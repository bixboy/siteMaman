// Non-régression visuelle : compare le rendu de la copie de travail avec un commit (HEAD par défaut).
// Usage : npm run test:visual [-- <commit>]   (à lancer avant de committer un changement de CSS/gabarit)
// Chaque page est capturée en entier à plusieurs largeurs ; les captures qui diffèrent sont
// enregistrées dans .cache/visual/ (avant/après) pour inspection.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { launchChrome, serve } from './helpers.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(ROOT, '.cache', 'visual');
const REF_DIR = path.join(CACHE, 'ref');
const REF = process.argv[2] ?? 'HEAD';
const PAGES = ['/', '/realisations.html', '/market.html', '/contact/contact.html',
  '/legal/mentionsLegal.html', '/legal/politiqueConf.html', '/vente/1-chaises-louis-xvi.html'];
const WIDTHS = [1440, 1280, 1024, 800, 768, 767, 600, 480, 375, 320];
// Le décodage des images varie de quelques niveaux d'un rendu à l'autre : on ignore ce bruit
const PIXEL_THRESHOLD = 32; // écart max sur un canal pour qu'un pixel compte comme différent
const MAX_PIXELS = 100; // nombre de pixels différents tolérés par capture
// Contenus tiers non déterministes (carte, statistiques)
const BLOCKED = /google\.com\/maps|googletagmanager\.com/;

// Rendu déterministe : pas d'animation, toutes les images chargées, polices prêtes
const FREEZE_CSS = `*, *::before, *::after { transition: none !important; animation: none !important; }
  .fade-up, .fade-in { opacity: 1 !important; transform: none !important; }`;

const git = (...args) => execFileSync('git', args, { cwd: ROOT, stdio: 'pipe' });
const build = (cwd) => execFileSync('npx eleventy --quiet', { cwd, stdio: 'pipe', shell: true });

rmSync(CACHE, { recursive: true, force: true });
mkdirSync(CACHE, { recursive: true });
git('worktree', 'prune');
git('worktree', 'add', '--detach', REF_DIR, REF);

const browser = await launchChrome();
const servers = [];
let differences = 0;
try {
  console.log(`Build de référence (${REF}) et de la copie de travail…`);
  build(REF_DIR); // les modules sont résolus depuis node_modules du projet (dossier parent)
  build(ROOT);
  const [before, after] = await Promise.all([serve(path.join(REF_DIR, '_site')), serve(path.join(ROOT, '_site'))]);
  servers.push(before, after);

  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => (BLOCKED.test(request.url()) ? request.abort() : request.continue()));
  const capture = async (base, url, width) => {
    await page.setViewport({ width, height: 900 });
    await page.goto(base + url, { waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: FREEZE_CSS });
    // decode() force le chargement des images différées et attend qu'elles soient prêtes à peindre
    await page.evaluate(() => Promise.all([...document.images].map((img) => {
      img.loading = 'eager';
      return img.decode().catch(() => {});
    })));
    await page.evaluate(() => document.fonts.ready);
    return page.screenshot({ fullPage: true });
  };

  for (const url of PAGES) {
    for (const width of WIDTHS) {
      const [a, b] = [await capture(before.url, url, width), await capture(after.url, url, width)];
      const [ra, rb] = await Promise.all([a, b].map((png) => sharp(png).raw().toBuffer({ resolveWithObject: true })));
      let changed = 0;
      if (ra.info.height === rb.info.height) {
        const { channels } = ra.info;
        for (let i = 0; i < ra.data.length; i += channels) {
          if (Math.abs(ra.data[i] - rb.data[i]) > PIXEL_THRESHOLD
            || Math.abs(ra.data[i + 1] - rb.data[i + 1]) > PIXEL_THRESHOLD
            || Math.abs(ra.data[i + 2] - rb.data[i + 2]) > PIXEL_THRESHOLD) changed++;
        }
      }
      if (ra.info.height !== rb.info.height || changed > MAX_PIXELS) {
        differences++;
        const name = `${url.replace(/[^a-z0-9]+/gi, '_')}-${width}`;
        await writeFile(path.join(CACHE, `${name}-avant.png`), a);
        await writeFile(path.join(CACHE, `${name}-apres.png`), b);
        const detail = ra.info.height !== rb.info.height
          ? `hauteur ${ra.info.height} → ${rb.info.height} px`
          : `${changed} pixels (${((100 * changed * ra.info.channels) / ra.data.length).toFixed(3)} %)`;
        console.log(`DIFF  ${url} @ ${width}px : ${detail}`);
      }
    }
  }
} finally {
  await browser.close();
  servers.forEach((s) => s.close());
  git('worktree', 'remove', '--force', REF_DIR);
}

const total = PAGES.length * WIDTHS.length;
console.log(differences
  ? `\n${differences}/${total} captures différentes (voir .cache/visual/)`
  : `\n${total} captures identiques à ${REF}`);
process.exit(differences ? 1 : 0);
