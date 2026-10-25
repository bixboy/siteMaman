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
- [ ] « Numéro SIRET : 979063310 » n'a que 9 chiffres (= SIREN). SIRET complet (14 chiffres) ?
- [ ] Fautes dans `produits.yml` à corriger ? (« velour », « légèrment vielli », « impecable »…)

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
- [ ] CSS : regrouper en `base` / `components` / `pages`, supprimer le code mort,
      unifier les breakpoints (767, 768, 480, 420, 355, 300 px).

## Phase 3 — SEO local & contenu
- [ ] Mesurer avec PageSpeed Insights (mobile) et noter les scores ici.
- [ ] Un seul `<h1>` par page (l'accueil en a 4, dont `.nameNav` dans la nav mobile).
- [ ] `alt` des réalisations (champ `alt` de `realisations.yml`, aujourd'hui « Réalisation N »).
- [ ] `description` propre à chaque page (en-tête des `.njk` ; seule l'accueil en a une).
- [ ] Fiche Google Business en « zone de service » ; ajouter son URL à `sameAs` (partial `jsonld.njk`).
      Remplacer la carte Google Maps de la page contact par la liste des communes desservies.
- [ ] Page « Services » détaillée (réfection traditionnelle / mousse, tissus, délais, devis).
      Idées dans le tag `archive/main-codex-2025-10` (dossier `services/`).
- [ ] Avis clients / FAQ (données structurées `FAQPage`).

## Phase 4 — Accessibilité, RGPD, qualité
- [ ] RGPD : GTM sans bandeau de consentement → bandeau (ex. tarteaucitron) ou mesure sans cookie.
- [ ] Politique de confidentialité générique (newsletter, formulaire, achats inexistants ; rien sur les cookies).
- [ ] Menu mobile au clavier (`<button>` au lieu de `<label for>` orphelin, `aria-expanded`), focus piégé dans les modales.
- [ ] Iframe Google Maps : `title`, chargement au clic.
- [ ] Icônes PNG/WebP (tel, mail, réseaux) → SVG inline.
- [ ] Filtres de la boutique : supprimer le faux chargement de 500 ms.

## Phase 5 — Outillage IA
- [ ] Skills `.claude/skills/` : `ajout-realisation`, `ajout-produit`, `produit-vendu`.
- [ ] `llms.txt` à la racine du site : résumé de l'activité pour les assistants IA de recherche.

## Historique
- Phase 0 (25/10/2026) : faille PHP supprimée (injection d'en-têtes), polices et animations
  réparées, CSS manquants, `lang="fr"`, liens Instagram vides, `.vs/` hors dépôt.
- Phase 1 (25/10/2026) : `npm run images` ; images 124 Mo → 8,9 Mo ; poids par page divisé par 10 à 18.
- Branches : ancien `main` (refactoring Codex jamais publié) archivé sous `archive/main-codex-2025-10`.
