// Non-régression visuelle : compare le rendu de la copie de travail avec un commit (HEAD par défaut).
// Usage : npm run test:visual [-- <commit>] [--rapide]   (avant de committer un changement de CSS/gabarit)
//   --rapide : 3 largeurs (1280, 768, 375) au lieu de 10
// Chaque page est capturée en entier à plusieurs largeurs ; les captures qui diffèrent sont
// enregistrées dans .cache/visual/ (avant/après) pour inspection.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { launchChrome, serve } from './helpers.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(ROOT, '.cache', 'visual');
const REF_DIR = path.join(CACHE, 'ref');
const args = process.argv.slice(2);
const REF = args.find((arg) => !arg.startsWith('--')) ?? 'HEAD';
const PAGES = ['/', '/realisations.html', '/market.html', '/contact/contact.html',
  '/legal/mentionsLegal.html', '/legal/politiqueConf.html', '/vente/1-chaises-louis-xvi.html'];
const WIDTHS = args.includes('--rapide')
  ? [1280, 768, 375]
  : [1440, 1280, 1024, 800, 768, 767, 600, 480, 375, 320];
// Le décodage des images varie de quelques niveaux d'un rendu à l'autre : on ignore ce bruit
const PIXEL_THRESHOLD = 32; // écart max sur un canal pour qu'un pixel compte comme différent
const MAX_PIXELS = 100; // nombre de pixels différents tolérés par capture
// Contenus tiers non déterministes (carte, statistiques)
const BLOCKED = /google\.com\/maps|googletagmanager\.com/;

// Rendu déterministe : pas d'animation, toutes les images chargées, polices prêtes
const FREEZE_CSS = `*, *::before, *::after { transition: none !important; animation: none !important; }
  .fade-up, .fade-in { opacity: 1 !important; transform: none !important; }`;

const git = (...gitArgs) => execFileSync('git', gitArgs, { cwd: ROOT, stdio: 'pipe' });
const build = (cwd) => execFileSync('npx eleventy --quiet', { cwd, stdio: 'pipe', shell: true });

rmSync(CACHE, { recursive: true, force: true });
mkdirSync(CACHE, { recursive: true });
git('worktree', 'prune');
git('worktree', 'add', '--detach', REF_DIR, REF);

// Ouvre la page une seule fois ; chaque largeur est ensuite obtenue en redimensionnant
async function openPage(browser, url) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => (BLOCKED.test(request.url()) ? request.abort() : request.continue()));
  await page.setViewport({ width: WIDTHS[0], height: 900 });
  await page.goto(url, { waitUntil: 'load' });
  await page.addStyleTag({ content: FREEZE_CSS });
  return page;
}

// Onglet au premier plan : Chrome ne peint pas les onglets en arrière-plan
// (img.decode() et requestAnimationFrame n'y aboutissent jamais)
async function capture(page, width) {
  await page.bringToFront();
  await page.setViewport({ width, height: 900 });
  // Après un redimensionnement, le navigateur peut choisir une autre image du srcset : on attend
  // la mise en page (2 frames), puis decode() (charge les images différées et attend qu'elles soient
  // prêtes à peindre), jusqu'à ce que plus aucune image ne change.
  await page.evaluate(async () => {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await document.fonts.ready;
    let previous;
    for (let attempt = 0; attempt < 5; attempt++) {
      await nextFrame();
      const images = [...document.images];
      await Promise.all(images.map((img) => {
        img.loading = 'eager';
        return img.decode().catch(() => {});
      }));
      const current = images.map((img) => img.currentSrc).join();
      if (current === previous && images.every((img) => img.complete)) return;
      previous = current;
    }
  });
  return page.screenshot({ fullPage: true });
}

async function countDifferences(a, b) {
  const [ra, rb] = await Promise.all([a, b].map((png) => sharp(png).raw().toBuffer({ resolveWithObject: true })));
  if (ra.info.height !== rb.info.height) return { detail: `hauteur ${ra.info.height} → ${rb.info.height} px`, changed: Infinity };
  const { channels } = ra.info;
  let changed = 0;
  for (let i = 0; i < ra.data.length; i += channels) {
    if (Math.abs(ra.data[i] - rb.data[i]) > PIXEL_THRESHOLD
      || Math.abs(ra.data[i + 1] - rb.data[i + 1]) > PIXEL_THRESHOLD
      || Math.abs(ra.data[i + 2] - rb.data[i + 2]) > PIXEL_THRESHOLD) changed++;
  }
  return { detail: `${changed} pixels (${((100 * changed * channels) / ra.data.length).toFixed(3)} %)`, changed };
}

const browser = await launchChrome();
const servers = [];
const report = [];
try {
  const start = Date.now();
  build(ROOT);
  // Réutilise les vignettes déjà générées : eleventy-img ne recalcule que celles qui manquent
  const images = path.join(ROOT, '_site', 'img');
  if (existsSync(images)) cpSync(images, path.join(REF_DIR, '_site', 'img'), { recursive: true });
  build(REF_DIR); // les modules sont résolus depuis node_modules du projet (dossier parent)
  console.log(`Builds (${REF} et copie de travail) : ${((Date.now() - start) / 1000).toFixed(1)} s`);

  const [before, after] = await Promise.all([serve(path.join(REF_DIR, '_site')), serve(path.join(ROOT, '_site'))]);
  servers.push(before, after);

  // Tous les onglets sont ouverts avant la première capture : un onglet qui s'ouvre passe au premier
  // plan et suspendrait le rendu de celui en cours de capture.
  const tabs = await Promise.all(PAGES.map((url) =>
    Promise.all([openPage(browser, before.url + url), openPage(browser, after.url + url)])));

  // Captures en série ; les comparaisons de pixels tournent pendant les captures suivantes
  const comparisons = [];
  for (const [index, url] of PAGES.entries()) {
    const [refPage, newPage] = tabs[index];
    for (const width of WIDTHS) {
      const a = await capture(refPage, width);
      const b = await capture(newPage, width);
      comparisons.push(countDifferences(a, b).then(async ({ changed, detail }) => {
        if (changed <= MAX_PIXELS) return;
        const name = `${url.replace(/[^a-z0-9]+/gi, '_')}-${width}`;
        await writeFile(path.join(CACHE, `${name}-avant.png`), a);
        await writeFile(path.join(CACHE, `${name}-apres.png`), b);
        report.push(`DIFF  ${url} @ ${width}px : ${detail}`);
      }));
    }
  }
  await Promise.all(comparisons);
  console.log(`Captures : ${((Date.now() - start) / 1000).toFixed(1)} s au total`);
} finally {
  await browser.close();
  servers.forEach((s) => s.close());
  git('worktree', 'remove', '--force', REF_DIR);
}

const total = PAGES.length * WIDTHS.length;
console.log(report.length
  ? `${report.sort().join('\n')}\n\n${report.length}/${total} captures différentes (voir .cache/visual/)`
  : `${total} captures identiques à ${REF}`);
process.exit(report.length ? 1 : 0);
