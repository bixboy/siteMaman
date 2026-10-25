// Tests de bout en bout : sert _site/ en local et vérifie les interactions dans Chrome.
// Usage : npm test (construit le site avant). Chrome : variable CHROME_PATH ou emplacement habituel.
// Les sélecteurs visent les attributs data-* (accroches du JS), pas les classes de style.
import path from 'node:path';
import { launchChrome, serve } from './helpers.mjs';

const server = await serve(path.resolve(import.meta.dirname, '..', '_site'));
const BASE = server.url;
const browser = await launchChrome();
const results = [];
const errors = [];
const check = (name, ok, detail = '') => results.push({ ok, line: `${ok ? 'OK  ' : 'ÉCHEC'} ${name}${detail ? ` (${detail})` : ''}` });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isOpen = (page, selector) => page.$eval(selector, (el) => !el.hidden);
const visibleProducts = (page) => page.$$eval('[data-etat]', (els) => els.filter((el) => !el.hidden).map((el) => el.dataset.etat));
const scrollY = (page) => page.evaluate(() => window.scrollY);

// Chaque page a son propre stockage. `choixCookies` : choix de consentement déjà enregistré
// (par défaut « refuse », pour que le bandeau ne gêne pas les autres tests) ; null = première visite.
// Les appels à Google Tag Manager sont interceptés (script vide) : aucun accès réseau externe.
async function open(url, { viewport = { width: 1280, height: 900 }, choixCookies = 'refuse' } = {}) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  if (choixCookies) {
    await page.evaluateOnNewDocument((choix) => {
      localStorage.setItem('consentement-audience', JSON.stringify({ choix, date: Date.now() }));
    }, choixCookies);
  }
  await page.setRequestInterception(true);
  page.on('request', (request) => (request.url().includes('googletagmanager.com')
    ? request.respond({ status: 200, contentType: 'text/javascript', body: '' })
    : request.continue()));
  await page.setViewport(viewport);
  page.on('pageerror', (err) => errors.push(`${url} : ${err.message}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`${url} : ${msg.text()}`); });
  await page.goto(BASE + url, { waitUntil: 'networkidle0' });
  return page;
}

try {
  // Réalisations : comparateur avant/après, photo simple
  {
    const page = await open('/realisations.html');
    await page.click('[data-avant][data-apres]');
    check('avant/après : ouverture', await isOpen(page, '#modale-avant-apres'));
    const before = await page.$eval('[data-image-avant]', (img) => img.getAttribute('src'));
    check('avant/après : photo « avant »', before.startsWith('/resources/Realisations/'), before);

    await page.waitForFunction(() => document.querySelector('[data-image-apres]').complete);
    const box = await (await page.$('[data-avant-apres]')).boundingBox();
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    const position = await page.$eval('[data-avant-apres]', (el) => Number(el.style.getPropertyValue('--pos')));
    check('avant/après : glisser le curseur', Math.abs(position - 25) < 3, `position ${position.toFixed(1)}`);
    await page.keyboard.press('ArrowRight');
    const afterKey = await page.$eval('[data-avant-apres]', (el) => Number(el.style.getPropertyValue('--pos')));
    check('avant/après : flèche du clavier', afterKey > position, `position ${afterKey}`);

    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    check('avant/après : le focus reste dans la modale (Tab)',
      await page.evaluate(() => document.getElementById('modale-avant-apres').contains(document.activeElement)));

    await page.keyboard.press('Escape');
    check('avant/après : fermeture Échap', !(await isOpen(page, '#modale-avant-apres')));
    await page.click('[data-avant][data-apres]');
    await page.click('#modale-avant-apres [data-modale-fermer]');
    check('avant/après : fermeture croix', !(await isOpen(page, '#modale-avant-apres')));

    const photoButton = await page.$('.galerie [data-photo]');
    await photoButton.scrollIntoView();
    await photoButton.click();
    const src = await page.$eval('[data-modale-image]', (img) => img.getAttribute('src'));
    check('photo : image pleine taille', src.startsWith('/resources/'), src);
    await page.mouse.click(5, 450);
    check('photo : fermeture clic sur le fond', !(await isOpen(page, '#modale-photo')));
    await page.close();
  }

  // Vente : filtres, liens vers les fiches
  {
    const page = await open('/market.html');
    const total = (await visibleProducts(page)).length;
    await page.click('[data-filter="restaure"]');
    const restaures = await visibleProducts(page);
    check('filtre « restaurés »', restaures.length > 0 && restaures.length < total
      && restaures.every((etat) => etat === 'restaure'), `${restaures.length}/${total}`);
    check('filtre : bouton actif', await page.$eval('[data-filter="restaure"]', (b) => b.getAttribute('aria-pressed')) === 'true');
    await page.click('[data-filter="all"]');
    check('filtre « tous »', (await visibleProducts(page)).length === total);
    const href = await page.$eval('[data-etat] a', (el) => el.getAttribute('href'));
    check('lien vers la fiche produit', /^\/vente\/\d+-[a-z0-9-]+\.html$/.test(href), href);
    await page.close();
  }

  // Fiche produit (la première a plusieurs photos)
  {
    const page = await open('/vente/1-chaises-louis-xvi.html');
    const current = () => page.$$eval('[data-vignette]', (els) => els.findIndex((el) => el.getAttribute('aria-current') === 'true'));
    const count = await page.$$eval('[data-vignette]', (els) => els.length);
    check('produit : 1re photo active', await current() === 0);
    await page.click('[data-suivant]');
    check('produit : flèche suivante', await current() === 1);
    await page.click('[data-precedent]');
    await page.click('[data-precedent]');
    check('produit : flèche précédente (boucle)', await current() === count - 1);
    await page.click('[data-vignette]');
    const [mainSrc, thumbSrc] = await page.evaluate(() => [
      document.querySelector('[data-photo-principale]').getAttribute('src'),
      document.querySelector('[data-vignette]').dataset.src,
    ]);
    check('produit : clic sur une vignette', mainSrc === thumbSrc, mainSrc);
    await page.click('[data-galerie-produit] [data-photo]');
    check('produit : photo agrandie', await isOpen(page, '#modale-photo'));
    await page.click('#modale-photo [data-modale-fermer]');
    check('produit : fermeture croix', !(await isOpen(page, '#modale-photo')));
    await page.close();
  }

  // Accueil : ancre sur la même page, en-tête au défilement, retour en haut, animations
  {
    const page = await open('/');
    await page.click('.navigation__liens a[href="/#prestations"]');
    await wait(1200);
    check('« Mes services » défile sans recharger', page.url() === `${BASE}/#prestations` && await scrollY(page) > 300);
    check('en-tête : ombre après défilement', await page.$eval('[data-entete]', (el) => el.classList.contains('is-scrolled')));
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await wait(300);
    await page.click('[data-scroll-top]');
    await wait(1500);
    check('retour en haut', await scrollY(page) < 50);
    check('animations initialisées', (await page.$$('.reveal')).length > 0);
    await page.close();
  }

  // Mobile : menu en panneau latéral
  {
    const page = await open('/realisations.html', { viewport: { width: 390, height: 844, isMobile: true, hasTouch: true } });
    const menuOpen = () => page.$eval('[data-menu-bouton]', (b) => b.getAttribute('aria-expanded') === 'true');
    await page.click('[data-menu-bouton]');
    check('menu mobile : ouverture', await menuOpen());
    await page.mouse.click(15, 600); // le fond assombri, à gauche du panneau
    check('menu mobile : fermeture clic sur le fond', !(await menuOpen()));
    await page.click('[data-menu-bouton]');
    check('menu mobile : focus sur le premier lien',
      await page.evaluate(() => document.activeElement === document.querySelector('[data-menu] a')));
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    check('menu mobile : le focus reste dans l\'en-tête (Tab)',
      await page.evaluate(() => document.querySelector('[data-entete]').contains(document.activeElement)));
    await page.keyboard.press('Escape');
    check('menu mobile : fermeture Échap', !(await menuOpen()));
    check('menu mobile : focus rendu au bouton',
      await page.evaluate(() => document.activeElement === document.querySelector('[data-menu-bouton]')));
    await page.click('[data-menu-bouton]');
    await wait(500); // animation d'ouverture
    await page.click('[data-menu] a[href="/#prestations"]');
    await wait(2500);
    check('menu mobile : « Mes services » depuis une autre page', page.url() === `${BASE}/#prestations`, page.url());
    await page.close();
  }

  // Consentement aux cookies (RGPD) : rien de Google avant un « Accepter »
  {
    const page = await open('/', { choixCookies: null });
    const bannerOpen = () => isOpen(page, '[data-consentement]');
    const tagManagerLoaded = async () => Boolean(await page.$('script[data-gtm]'));
    check('cookies : bandeau affiché à la première visite', await bannerOpen());
    check('cookies : aucun script Google avant consentement', !(await tagManagerLoaded()));
    await page.click('[data-consentement-choix="refuse"]');
    check('cookies : refus → bandeau fermé, rien de Google', !(await bannerOpen()) && !(await tagManagerLoaded()));
    await page.reload({ waitUntil: 'networkidle0' });
    check('cookies : refus mémorisé', !(await bannerOpen()));
    await page.click('[data-consentement-ouvrir]');
    check('cookies : « Gérer les cookies » rouvre le bandeau', await bannerOpen());
    await page.click('[data-consentement-choix="accepte"]');
    check('cookies : acceptation → Google Tag Manager chargé', await tagManagerLoaded());
    await page.reload({ waitUntil: 'networkidle0' });
    check('cookies : acceptation mémorisée', !(await bannerOpen()) && await tagManagerLoaded());
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
