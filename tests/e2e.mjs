// Tests de bout en bout : sert _site/ en local et vérifie les interactions dans Chrome.
// Usage : npm test (construit le site avant). Chrome : variable CHROME_PATH ou emplacement habituel.
import path from 'node:path';
import { launchChrome, serve } from './helpers.mjs';

const server = await serve(path.resolve(import.meta.dirname, '..', '_site'));
const BASE = server.url;
const browser = await launchChrome();
const results = [];
const errors = [];
const check = (name, ok, detail = '') => results.push({ ok, line: `${ok ? 'OK  ' : 'ÉCHEC'} ${name}${detail ? ` (${detail})` : ''}` });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const display = (page, selector) => page.$eval(selector, (el) => getComputedStyle(el).display);
const visibleProducts = (page) => page.$$eval('.product-item', (els) =>
  els.filter((el) => getComputedStyle(el).display !== 'none').map((el) => el.dataset.etat));

async function open(url, viewport = { width: 1280, height: 900 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on('pageerror', (err) => errors.push(`${url} : ${err.message}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`${url} : ${msg.text()}`); });
  await page.goto(BASE + url, { waitUntil: 'networkidle0' });
  return page;
}

try {
  // Réalisations : comparateur avant/après, photo simple, défilement
  {
    const page = await open('/realisations.html');
    await page.click('.modal-trigger1');
    check('avant/après : ouverture', await display(page, '#myModal') === 'block');
    const background = await page.$eval('#myModal .slider__before', (el) => el.style.backgroundImage);
    check('avant/après : image « avant »', background.includes('/resources/Realisations/'), background);
    await page.keyboard.press('Escape');
    check('avant/après : fermeture Échap', await display(page, '#myModal') === 'none');
    await page.click('.modal-trigger1');
    await page.click('#myModal .close');
    check('avant/après : fermeture croix', await display(page, '#myModal') === 'none');

    await page.$eval('.modal-trigger2', (el) => el.scrollIntoView());
    await page.click('.modal-trigger2');
    const src = await page.$eval('#image', (el) => el.getAttribute('src'));
    check('photo simple : image pleine taille', src.startsWith('/resources/'), src);
    await page.mouse.click(5, 300);
    check('photo simple : fermeture clic sur le fond', await display(page, '#myModalIMG') === 'none');

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('[data-scroll-to="containerSieges"]');
    await wait(1200);
    check('bouton « Voir les réalisations »', await page.evaluate(() => window.scrollY) > 300);
    await page.close();
  }

  // Vente : filtres, liens vers les fiches
  {
    const page = await open('/market.html');
    const total = (await visibleProducts(page)).length;
    await page.click('[data-filter="restaure"]');
    await wait(800);
    const restaures = await visibleProducts(page);
    check('filtre « restaurés »', restaures.length > 0 && restaures.length < total
      && restaures.every((etat) => etat === 'restaure'), `${restaures.length}/${total}`);
    await page.click('[data-filter="all"]');
    await wait(800);
    check('filtre « tous »', (await visibleProducts(page)).length === total);
    const href = await page.$eval('.view-details', (el) => el.getAttribute('href'));
    check('lien vers la fiche produit', /^\/vente\/\d+-[a-z0-9-]+\.html$/.test(href), href);
    await page.close();
  }

  // Fiche produit (la première a plusieurs photos)
  {
    const page = await open('/vente/1-chaises-louis-xvi.html');
    const active = () => page.$$eval('.ImgSlider', (els) => els.findIndex((el) => el.classList.contains('active')));
    const count = await page.$$eval('.ImgSlider', (els) => els.length);
    check('produit : 1re photo active', await active() === 0);
    await page.click('.next');
    check('produit : flèche suivante', await active() === 1);
    await page.click('.prev');
    await page.click('.prev');
    check('produit : flèche précédente (boucle)', await active() === count - 1);
    // Les photos suivantes sont en loading="lazy" : attendre qu'elle soit chargée pour cliquer
    await page.waitForFunction(() => document.querySelector('.ImgSlider.active')?.naturalWidth > 0);
    await page.click('.ImgSlider.active');
    check('produit : modale photo', await display(page, '#myModalIMG') === 'block');
    await page.click('#myModalIMG .close');
    check('produit : fermeture croix', await display(page, '#myModalIMG') === 'none');
    await page.close();
  }

  // Accueil : ancre sur la même page, retour en haut, navbar, animations
  {
    const page = await open('/');
    await page.click('.linksOrdi a[href="/#prestations"]');
    await wait(1200);
    check('« Mes services » défile sans recharger', page.url() === `${BASE}/` && await page.evaluate(() => window.scrollY) > 300);
    check('navbar .scrolled après défilement', await page.$eval('.box_navbar', (el) => el.classList.contains('scrolled')));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.click('[data-scroll-top]');
    await wait(1500);
    check('retour en haut', await page.evaluate(() => window.scrollY) < 50);
    check('animations initialisées', (await page.$$('.fade-up')).length > 0);
    await page.close();
  }

  // Mobile : menu burger
  {
    const page = await open('/realisations.html', { width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.click('#menu');
    check('menu mobile : ouverture', await page.$eval('.nav-links', (el) => el.classList.contains('mobile-menu')));
    await page.mouse.click(30, 700);
    check('menu mobile : fermeture clic dehors', !(await page.$eval('.nav-links', (el) => el.classList.contains('mobile-menu'))));
    await page.click('#menu');
    await wait(800); // animation d'ouverture
    await page.click('.nav-links a[href="/#prestations"]');
    await wait(2500);
    check('menu mobile : « Mes services » depuis une autre page', page.url() === `${BASE}/#prestations`, page.url());
    await page.close();
  }

  // Ancienne URL de fiche produit
  {
    const page = await open('/product.html');
    await wait(500);
    check('product.html redirige vers market.html', page.url().endsWith('/market.html'), page.url());
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(results.map((r) => r.line).join('\n'));
if (errors.length) console.log(`\nErreurs JS :\n${errors.join('\n')}`);
const failed = results.filter((r) => !r.ok).length + errors.length;
console.log(failed ? `\n${failed} problème(s)` : `\n${results.length} tests OK`);
process.exit(failed ? 1 : 0);
