# Main é Merveille — site vitrine

Tapissière d'ameublement à Caen (14), intervention à domicile : pas d'adresse d'atelier, ne jamais en inventer.
Prod : https://www.main-e-merveille.fr — contenu, commentaires et commits en français.

## Stack
Eleventy 3 (gabarits Nunjucks + données YAML) → HTML statique dans `_site/`.
JS natif en modules ES, CSS sans préprocesseur. Analytics : GTM (id dans `site.yml`).

## Branches et mise en ligne
Deux branches seulement : `Work` (développement, branche de travail par défaut) et `main` (publication).
Fusionner `Work` dans `main` puis pousser → GitHub Action (`.github/workflows/deploy.yml`) :
`npm test`, build, envoi de `_site/` sur OVH par FTP. **Push sur `main` = mise en ligne** :
jamais sans accord explicite. Ne jamais committer directement sur `main`.

## Commandes
- `npm run dev` — serveur local avec rechargement (http://localhost:8080)
- `npm test` — build + tests navigateur (Chrome requis) ; à lancer après chaque modification
- `npm run test:visual [-- --rapide]` — compare le rendu (7 pages × 10 largeurs) avec `HEAD` ; ~40 s (~15 s en rapide)
- `npm run images` — convertit/renomme les nouvelles images de `src/resources/` et met à jour les chemins

## Carte
- `src/_data/` — **le contenu** : `site.yml` (coordonnées, SEO), `produits.yml`, `realisations.yml`,
  `fournisseurs.yml`, `etats.yml` (libellés des états produit)
- `src/_includes/layouts/base.njk` — `<head>` (SEO, Open Graph, polices, CSS), nav, footer, script
- `src/_includes/partials/` — `nav.njk` (liste des liens), `footer.njk`, `jsonld.njk`
- `src/*.njk`, `src/contact/`, `src/legal/` — pages ; en-tête : `title`, `description`, `permalink`,
  `nav` (lien actif), `styles` (CSS propres à la page)
- `src/vente/produit.njk` — une page par produit (`/vente/<id>-<slug>.html`)
- `src/js/main.js` — point d'entrée ; un module par fonctionnalité ; `modal.js` partagé
- `src/css/` — `base.css` (variables `:root`, reset, animations) et `layout.css` (nav, footer) sur toutes les pages ;
  `components/` (hero, legal-hero, modal, before-after) et `pages/` (un fichier par page), déclarés dans `styles`.
  Les CSS des pages légales stylent des balises nues (`h1`, `p`, `a`) : ne jamais les charger ailleurs.
- `src/resources/` — images sources (WebP ≤ 1600 px) ; vignettes générées dans `/img/`
- `eleventy.config.js` — filtres `produitUrl`, `nl2br` ; shortcode `image`
- `tests/e2e.mjs` — tests d'interaction ; `tests/visual.mjs` — non-régression visuelle ; `tests/helpers.mjs` — serveur + Chrome
- `scripts/optimize-images.mjs` — `npm run images`
- `docs/CONTENU.md` — ajouter un contenu ; `docs/ROADMAP.md` — plan, points à confirmer, historique

## Règles
- Contenu (texte, produit, réalisation, coordonnées) : modifier les YAML de `src/_data/`, pas les gabarits.
- Images : les déposer dans `src/resources/` puis `npm run images` ; jamais de recompression à la main.
  Ne pas ouvrir les images sauf demande : s'appuyer sur les noms de fichiers.
- Vignette de grille : `{% image "Dossier/fichier.webp", "alt", "sizes" %}` ; image d'en-tête : `<img fetchpriority="high">`.
- CSS : variables de `base.css` ; jamais de `style=""` ni de `onclick` ; comportements dans `src/js/` via `data-*`.
- Chemins absolus partout (`/resources/…`, `/market.html`). Ne pas changer les URLs existantes (référencement).
- Seuil mobile : `@media (max-width: 767px)` / ordinateur : `@media (min-width: 768px)` ; menu complet dès 992 px.
- Fichiers en CRLF : préférer l'outil Edit à `sed -i` (qui convertit en LF).

## Vérifier
`npm test` doit finir par « N tests OK ». Refactoring CSS/gabarit (rendu censé rester identique) :
`npm run test:visual` doit finir par « captures identiques » ; sinon inspecter `.cache/visual/` (avant/après).
Changement visuel voulu : `npm run dev`, contrôler mobile (375 px) et desktop.
Nouvelle interaction JS : ajouter un test dans `tests/e2e.mjs`.
