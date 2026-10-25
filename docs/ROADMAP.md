# Plan d'amélioration

Cocher `[x]` au fur et à mesure. Une phase = une branche.

## Décisions
- Hébergement OVH. Deux branches : `Work` (dev) et `main` (publication). Un push sur `main`
  déclenche GitHub Actions : tests, build, envoi de `_site/` par FTP (le déploiement Git d'OVH
  est désactivé, car il ne sait pas construire le site).
- Pas de formulaire (contact = `mailto:` + téléphone), pas d'Instagram (Facebook seul).
- Pas d'atelier : intervention à domicile (Caen, Calvados) → SEO de « zone de service ».
- URLs historiques conservées : `/`, `/realisations.html`, `/market.html`, `/contact/contact.html`, `/legal/*.html`.

## À confirmer par la propriétaire
- [x] Email : `mainemerveille@gmail.com` partout (mentions légales corrigées, tirées de `site.yml`).
- [x] SIRET complet (979 063 310 00010) et informations RNE dans les mentions légales (`site.legal`).
- [x] Fautes corrigées dans `produits.yml` et noms des fournisseurs.

## Phase 2 — Eleventy
- [x] Structure `src/` : layout + partials (nav, footer, JSON-LD), pages `.njk`, données YAML
      (`site`, `produits`, `realisations`, `fournisseurs`, `etats`).
- [x] Une page par produit (`/vente/<id>-<slug>.html`) ; `product.html` redirige vers `market.html`.
- [x] Vignettes responsives (eleventy-img, 400/800/1200 px, `width`/`height`) : galerie, boutique, accueil.
- [x] `sitemap.xml` généré (domaine `www`, toutes les pages). JSON-LD « zone de service » sur toutes les pages.
- [x] JS en modules ES, une modale partagée (Échap, clic fond, croix) ; plus de `onclick` ni de `localStorage`.
- [x] Bug corrigé : la navbar (z-index 1000) masquait la croix des modales (15).
- [x] `npm test` : build + 23 tests navigateur (puppeteer-core) ; lancé par la CI avant chaque déploiement.
- [x] Rendu comparé au site en ligne (desktop + mobile) : identique, hors rééchantillonnage des vignettes.
- [ ] Bascule : secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` dans GitHub ; déploiement Git
      désactivé dans OVH ; fusion de `Work` dans `main` ; vérification en ligne ; suppression des
      fichiers laissés par l'ancien déploiement Git dans `www/` (`.git/`, `docs/`, `scripts/`, `CLAUDE.md`, `package*.json`).
- [x] CSS : `base` / `layout` / `components` / `pages` (17 → 12 fichiers), code mort supprimé,
      seuil unique 767/768 px (avant : 768 px mi-mobile mi-ordinateur). Rendu vérifié par `npm run test:visual`.

## Refonte visuelle « Versailles / Louis XVI »
- [x] Système de design dans `base.css` (ivoire, or vieilli, vert canard ; Cormorant Garamond, Cinzel,
      Source Sans 3 ; cadres dorés, panneaux, ornements, frise de perles).
- [x] Toutes les pages refaites ; accueil enrichi (bandeau avec titre, services, aperçu des réalisations,
      encart devis) ; galerie en mosaïque ; fiches produit avec vignettes ; pages légales en colonne de lecture.
- [x] Menu mobile en panneau latéral (`<button>`, `aria-expanded`, Échap) ; modales accessibles
      (`role="dialog"`, focus) ; comparateur avant/après souris, tactile et clavier ; icônes SVG.
- [x] Faux chargement de 500 ms des filtres supprimé ; carte Google Maps remplacée par la zone d'intervention.
- [ ] Validation par la propriétaire (textes du bandeau d'accueil et de « À propos » légèrement reformulés).

## Phase 3 — SEO local & contenu
- [x] Un seul `<h1>` par page (celui du bandeau).
- [x] `alt` descriptifs des 14 réalisations (`realisations.yml`) ; repris dans le comparateur avant/après.
- [x] `title` et `description` propres à chaque page (fiches produit générées), Open Graph complet
      (image par page, `og:locale`, `twitter:card`).
- [x] JSON-LD : `hasMap` + `sameAs` (Facebook, fiche Google) ; fil d'Ariane sur les fiches produit.
- [x] `.htaccess` : une seule adresse `https://www.` (301), cache 30 j images/polices, 404 aux couleurs
      du site, fichiers internes de l'ancien déploiement Git bloqués.
- [x] Performance : image du bandeau en 640/1024/1600 px ; polices auto-hébergées (plus d'appel à
      Google Fonts : plus rapide et plus conforme au RGPD).
- [x] Aperçu de test sur GitHub Pages (branche `Work`), non indexé.
- [ ] Vérifier que https://www.google.com/maps?cid=623214297286068827 ouvre bien la fiche de l'entreprise
      (identifiant repris de l'ancienne carte) ; la passer en « zone de service » (adresse masquée).
- [x] Publiée le 25/10/2026 (FTP classique : OVH mutualisé refuse FTPS) : 18 pages en 200, redirections 301
      vers `https://www.`, 404 personnalisée, fichiers internes en 403, aucun appel Google avant consentement.
- [ ] Google Search Console + Bing Webmaster Tools (voir `docs/REFERENCEMENT.md`).
- [ ] Supprimer par FTP les restes de l'ancien déploiement Git dans `www/` (`.git/`, `CLAUDE.md`, `docs/`,
      `scripts/`, `package*.json`, anciens dossiers `css/*-components/`) : bloqués mais encore présents.
- [x] Page `/services.html` (prestations, déroulé, lexique public ↔ métier, communes, FAQ + `FAQPage`),
      `<h1>` d'accueil « Tapissière d'ameublement à Caen », légendes visibles des réalisations,
      données structurées enrichies (communes, catalogue de services), IndexNow, sitemap complet (18 pages).
- [ ] Faire valider `/services.html` et la FAQ par la propriétaire ; l'enrichir si elle le souhaite (délais,
      garnissage traditionnel ou mousse, tissu fourni par le client, enlèvement/livraison…).
- [ ] Actions hors site : voir `docs/REFERENCEMENT.md` (Search Console, Bing, fiche Google, avis, annuaires).

## Phase 4 — Accessibilité, RGPD, qualité
- [x] Contrastes WCAG AA : or foncé `#7a5c28` pour tout texte doré ; or clair réservé au décor.
- [x] Focus clavier prisonnier dans les modales et le menu mobile, rendu à l'élément d'origine.
- [x] RGPD : bandeau de consentement maison (`js/consent.js`) ; Google Tag Manager chargé seulement après
      « Accepter », refus aussi simple, choix 6 mois, « Gérer les cookies » en pied de page, cookies
      Google effacés en cas de retrait ; jamais chargé sur l'aperçu.
- [x] Politique de confidentialité réécrite selon le fonctionnement réel du site (section `#cookies`).
- [x] Validation HTML (`html-validate`, règles recommandées) dans `npm test` et la CI ; 0 erreur.
- [ ] Confirmer le contenu du conteneur GTM (Google Analytics seul ? autre balise ?) : la politique
      de confidentialité mentionne Google Analytics.
- [x] Mentions légales : éditrice, responsable de la publication, SIRET, TVA, APE, RNE ; adresse limitée
      à « 14000 Caen » (choix de la propriétaire, alors que la LCEN demande l'adresse complète de l'éditeur).
- Lighthouse mobile sur l'aperçu (25/10/2026), accueil / réalisations / vente : performance 97,
  accessibilité 100, bonnes pratiques 100 ; SEO 66 uniquement à cause du `noindex` de l'aperçu.
  LCP 2,0–2,1 s, CLS 0, TBT ≤ 20 ms.

## Phase 5 — Outillage IA
- [x] Skills `.claude/skills/` : `ajout-realisation`, `ajout-produit`, `produit-vendu`, `publier`.
- [x] `.claude/settings.json` : commandes sûres autorisées (tests, images, git local), lecture de
      `node_modules` / `.cache` interdite, `push --force` interdit.
- [x] `llms.txt` (généré depuis les données) : activité, contacts, pages, produits à vendre, fournisseurs.

## Historique
- Phase 0 (25/10/2026) : faille PHP supprimée (injection d'en-têtes), polices et animations
  réparées, CSS manquants, `lang="fr"`, liens Instagram vides, `.vs/` hors dépôt.
- Phase 1 (25/10/2026) : `npm run images` ; images 124 Mo → 8,9 Mo ; poids par page divisé par 10 à 18.
- Branches : ancien `main` (refactoring Codex jamais publié) archivé sous `archive/main-codex-2025-10`.
- Phases 2 à 5 (25/10/2026, branche `Work`, pas encore publiées) : Eleventy + données YAML, refonte
  « Versailles / Louis XVI », SEO, accessibilité AA, consentement RGPD, aperçu GitHub Pages, skills IA.
