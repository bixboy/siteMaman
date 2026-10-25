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
Push sur `Work` → aperçu de test (`.github/workflows/apercu.yml`) : https://bixboy.github.io/siteMaman/,
construit avec `APERCU=1` et `--pathprefix=/siteMaman/` (noindex, badge « Aperçu de test »).

## Commandes
- `npm run dev` — serveur local avec rechargement (http://localhost:8080)
- `npm test` — build + validation HTML + tests navigateur (Chrome requis) ; à lancer après chaque modification
- `npm run test:visual [-- --rapide]` — compare le rendu (7 pages × 10 largeurs) avec `HEAD` ; ~40 s (~15 s en rapide)
- `npm run images` — convertit/renomme les nouvelles images de `src/resources/` et met à jour les chemins

## Tâches courantes (skills `.claude/skills/`, procédures complètes)
- `/ajout-realisation` — photos d'un siège restauré → galerie (avant/après ou photo simple)
- `/ajout-produit` — mettre un fauteuil en vente (+ fiche produit)
- `/produit-vendu` — retirer un produit vendu
- `/publier` — mise en ligne de `Work` sur le site (confirmation obligatoire)

## Carte
- `src/_data/` — **le contenu** : `site.yml` (coordonnées, horaires, SEO), `produits.yml`, `realisations.yml`,
  `services.yml`, `faq.yml`, `lexique.yml`, `fournisseurs.yml`, `etats.yml` (libellés des états produit)
- `src/_includes/layouts/base.njk` — `<head>` (SEO, Open Graph, polices, CSS), en-tête, pied, script
- `src/_includes/partials/` — `entete.njk` (liste des liens), `pied.njk`, `jsonld.njk`, `icones.njk` (macro `icone`),
  `bandeau.njk` (macro `bandeau` : `<h1>` de la page), `appel.njk` (encart devis), `modale-photo.njk`, `modale-avant-apres.njk`
- `src/*.njk`, `src/contact/`, `src/legal/` — pages ; en-tête : `title`, `description`, `permalink`,
  `nav` (lien actif), `styles` (CSS propres à la page)
- `src/vente/produit.njk` — une page par produit (`/vente/<id>-<slug>.html`)
- `src/js/main.js` — point d'entrée ; un module par fonctionnalité ; `modal.js` partagé
- `src/css/` — `base.css` (système de design : variables, typo, boutons, cadres…) et `layout.css` (en-tête, pied)
  sur toutes les pages ; `components/` (bandeau, appel, modale, avant-apres) et `pages/` (un fichier par page),
  déclarés dans `styles`.
- `src/resources/` — images sources (WebP ≤ 1600 px) ; vignettes générées dans `/img/` (`lib/images.js`,
  photo du bandeau : `src/_data/imageBandeau.js`)
- `src/css/polices.css` — polices auto-hébergées (`@fontsource`, copiées dans `/fonts/`) : aucun appel à Google Fonts
- `src/.htaccess` — Apache OVH : redirection vers `https://www.`, cache, 404 ; `src/404.njk`, `src/robots.njk`, `src/sitemap.njk`,
  `src/llms.njk` (résumé pour les assistants IA, généré depuis les données)
- `eleventy.config.js` — filtres `produitUrl`, `nl2br`, `uneLigne` ; shortcode `image` ; plugin de préfixe (aperçu)
- `tests/e2e.mjs` — tests d'interaction ; `tests/visual.mjs` — non-régression visuelle ; `tests/helpers.mjs` — serveur + Chrome
- `scripts/optimize-images.mjs` — `npm run images` ; `scripts/indexnow.mjs` — signale les pages à Bing après publication (CI)
- `docs/CONTENU.md` — ajouter un contenu ; `docs/ROADMAP.md` — plan, points à confirmer, historique ;
  `docs/REFERENCEMENT.md` — actions hors site (Search Console, fiche Google, avis, annuaires)
- `.claude/settings.json` — commandes autorisées sans confirmation ; lecture de `node_modules`, `.cache` interdite

## Règles
- Contenu (texte, produit, réalisation, coordonnées) : modifier les YAML de `src/_data/`, pas les gabarits.
- Images : les déposer dans `src/resources/` puis `npm run images` ; jamais de recompression à la main.
  Ne pas ouvrir les images sauf demande : s'appuyer sur les noms de fichiers.
- Vignette de grille : `{% image "Dossier/fichier.webp", "alt", "sizes" %}` ; image d'en-tête : `<img fetchpriority="high">`.
- Design « Versailles / Louis XVI » : ivoire, or vieilli, vert canard ; titres Cormorant Garamond, petites capitales
  Cinzel, texte Source Sans 3. Réutiliser les classes de `base.css` (`section`, `titre-section`, `sur-titre`,
  `ornement`, `bouton`, `cadre`, `panneau`, `etiquette`, `frise`) et ses variables ; aucune couleur en dur.
- Classes CSS = style ; le JS s'accroche uniquement aux attributs `data-*` (ex. `data-photo`, `data-filter`).
  Jamais de `style=""` ni de `onclick`. Un seul `<h1>` par page (celui du bandeau).
- Chemins absolus partout (`/resources/…`, `/market.html`) : préfixés automatiquement pour l'aperçu dans
  `href`/`src`/`srcset`. Dans un attribut `data-*`, passer par le filtre : `{{ ("/resources/" ~ x) | url }}` ;
  dans le CSS, chemins relatifs. Ne pas changer les URLs existantes (référencement).
- RGPD : aucun script ou service tiers (Google, Facebook, cartes, vidéos…) chargé sans passer par le
  consentement (`js/consent.js`) ; tout nouveau traitement de données → mettre à jour `legal/politiqueConf.njk`.
- Accessibilité : texte doré uniquement en `--or-fonce` ; éléments interactifs = `<button>` ou `<a>` ;
  `npm test` valide aussi le HTML (`html-validate`) : corriger toute erreur plutôt que désactiver la règle.
- SEO : chaque page a `title` (< 65 caractères, avec « Caen ») et `description` (< 160) dans son en-tête ;
  chaque photo a un `alt` qui décrit ce qu'on voit (siège, tissu, couleur).
- Seuil mobile : `@media (max-width: 767px)` / ordinateur : `@media (min-width: 768px)` ; menu complet dès 992 px.
- Fichiers en CRLF : préférer l'outil Edit à `sed -i` (qui convertit en LF).

## Vérifier
`npm test` doit finir par « N tests OK ». Refactoring CSS/gabarit (rendu censé rester identique) :
`npm run test:visual` doit finir par « captures identiques » ; sinon inspecter `.cache/visual/` (avant/après).
Changement visuel voulu : `npm run dev`, contrôler mobile (375 px) et desktop.
Nouvelle interaction JS : ajouter un test dans `tests/e2e.mjs`.
