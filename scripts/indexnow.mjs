// Signale toutes les pages du sitemap à IndexNow (Bing, Yandex, Seznam…) : indexation en quelques heures
// au lieu de plusieurs semaines. Lancé par la CI après chaque publication (.github/workflows/deploy.yml).
// Usage : node scripts/indexnow.mjs (après le build ; lit _site/sitemap.xml et src/_data/site.yml)
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const site = loadYaml(await readFile(path.join(ROOT, 'src/_data/site.yml'), 'utf8'));
const sitemap = await readFile(path.join(ROOT, '_site/sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(site.url).host,
    key: site.indexNowKey,
    keyLocation: `${site.url}/${site.indexNowKey}.txt`,
    urlList,
  }),
});

// 200 = accepté, 202 = accepté (clé en cours de vérification) ; le reste est signalé sans bloquer la publication
console.log(`IndexNow : ${urlList.length} URL envoyées → HTTP ${response.status}`);
if (![200, 202].includes(response.status)) console.log(`::warning title=IndexNow::HTTP ${response.status} ${await response.text()}`);
