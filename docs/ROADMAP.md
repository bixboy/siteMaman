# Plan d'amélioration

Audit du 25/10/2026. Cocher `[x]` au fur et à mesure. Une phase = une branche / une PR.

## ⚠ Branches et mise en ligne (à régler en premier)
Constat du 25/10/2026 : le site en ligne est **identique au commit `aa0821f`** (ex-`BackUp`),
pas à `main`. `main` (oct. 2025, refactoring Codex : page `services/`, dossier `recources/`,
formulaire) a divergé de `Work` depuis `5c0ce3b` et n'a jamais été fusionnée.
La branche `BackUp` a été supprimée sur GitHub. La faille PHP reste donc en ligne.
- [x] Ancien `main` archivé (tag `archive/main-codex-2025-10`) puis fusionné en stratégie `ours` :
      `main` = `Work`, sans réécriture d'historique. `main` est la branche de production.
- [ ] Dans le manager OVH (Hébergement → Git), faire suivre `main` et déployer ;
      vérifier que `contact/traitement_formulaire.php` renvoie 404. Supprimer ensuite `Work` et `BackUp` en local.
- [ ] Récupérer éventuellement des idées du refactoring Codex (page services, sitemap) en phase 3.

## Décisions
- Hébergement OVH, publié automatiquement depuis le dépôt GitHub `bixboy/siteMaman`
  (OVH copie les fichiers tels quels, **sans étape de build**).
- Pas de formulaire de contact : email (`mailto:`) et téléphone uniquement.
- Pas d'Instagram ; Facebook seul.
- Pas d'atelier : intervention à domicile (Caen et Calvados) → SEO de « zone de service ».

## Phase 0 — Corrections urgentes
- [x] **Sécurité** : `contact/traitement_formulaire.php` supprimé (injection d'en-têtes
      → relais de spam possible ; le formulaire n'existait plus).
- [x] Polices Cinzel/Lato jamais chargées (`@import` mal placé dans `body.css`) → `<link>` + `preconnect` dans chaque `<head>`.
- [x] `initAnimations` déclarée dans `initModalLogic` (`ReferenceError`, animations au scroll inactives) → sortie au niveau global.
- [x] Références vers des CSS inexistants retirées (`prestations-components/top.css`, `contact-components/horaires.css`).
- [x] `lang="fr"` sur `contact/` et `legal/`.
- [x] Liens Instagram vides et icônes associées supprimés.
- [x] `.gitignore` + retrait de `.vs/` du dépôt.
- [x] Vérification visuelle desktop (Chrome headless) : mise en page identique au site en ligne,
      seule la police des titres change. Reste à contrôler sur un vrai téléphone.

## Phase 1 — Performance (gain le plus visible)
- [x] `npm run images` (`scripts/optimize-images.mjs`, sharp) : WebP q75, plus grand côté ≤ 1600 px,
      noms normalisés via `git mv`, chemins mis à jour. `resources/` : 124 Mo → 8,9 Mo.
- [x] 8 images inutilisées supprimées (≈ 18 Mo).
- [x] Galerie : `srcset` sans descripteur remplacé par `src`.
- [x] `loading="lazy"` sur les images du contenu, `fetchpriority="high"` sur l'image d'en-tête.
- Poids des images par page, avant → après : accueil 8,6 → 0,9 Mo ; réalisations 35,4 → 4,2 Mo ;
  vente 49,8 → 2,8 Mo ; contact 2,1 → 0,3 Mo.
- [ ] Mesurer avec PageSpeed Insights (mobile) une fois en ligne et noter les scores ici.
- Reporté en phase 2 (fait automatiquement par eleventy-img) : vignettes réduites pour la
  galerie et la boutique (elles chargent aujourd'hui l'image 1600 px), `width`/`height` sur les `<img>`.

## Phase 2 — Architecture maintenable (proposition : Eleventy)
Problèmes : nav/footer/head copiés dans 7 pages ; coordonnées en dur partout ;
contenu (réalisations, produits) noyé dans le HTML ; fiche produit via `localStorage`
(non indexable, lien non partageable, page vide si on arrive directement dessus).

Eleventy (11ty) génère du HTML statique : même hébergement, aucun JS en plus côté visiteur.
OVH ne lance pas de build : une GitHub Action construit le site à chaque push sur `main`
et pousse le résultat (`_site/`) sur une branche `deploy`, que OVH suit à la place de `main`.
- [ ] GitHub Action build → branche `deploy` ; basculer la branche suivie dans le manager OVH.
- [ ] Structure `src/` : `_includes/` (layout, nav, footer, head SEO), `_data/`, pages.
- [ ] `_data/site.json` : nom, téléphone, email, réseaux, adresse → une seule source.
- [ ] `_data/realisations.yml` et `_data/produits.yml` : ajouter un contenu = ajouter 4 lignes.
- [ ] Une page par produit générée (`/vente/<slug>/`) → supprime la logique `localStorage`.
- [ ] Images via `@11ty/eleventy-img` : AVIF + WebP en plusieurs tailles, `srcset` automatique.
- [ ] `sitemap.xml` généré (aujourd'hui : domaine sans `www` ≠ canonical, `market.html` absent, dates 2023).
- [ ] CSS : regrouper en `base` / `components` / `pages`, supprimer le code mort,
      unifier les breakpoints (aujourd'hui 767, 768, 480, 420, 355, 300 px).
- [ ] `main.js` découpé en modules ES (`nav.js`, `gallery.js`, `before-after.js`…),
      une seule modale réutilisable au lieu de trois implémentations.
- [ ] Commandes `npm run dev` / `npm run build`, déploiement documenté dans `CLAUDE.md`.
- [ ] Seul `_site/` est publié : `CLAUDE.md`, `docs/`, `scripts/`, `package.json` ne seront plus
      accessibles publiquement (ils le sont tant qu'OVH copie tout le dépôt).

## Phase 3 — SEO local & contenu
- [ ] Un seul `<h1>` par page (l'accueil en a 4, dont un caché dans la nav mobile).
- [ ] `alt` descriptifs sur les réalisations (actuellement `"1"`, `"2"`…).
- [ ] `title` / `description` / Open Graph propres à chaque page (description identique partout).
- [ ] JSON-LD de zone de service sur toutes les pages : retirer `streetAddress` vide et `geo`
      (pointe vers le centre de Caen), garder `addressLocality`/`postalCode`, ajouter
      `areaServed` (Caen, Calvados), `sameAs` (Facebook, fiche Google), `@id` renseigné.
- [ ] Fiche Google Business en mode « zone de service » (adresse masquée). Une fiche semble
      exister : la carte de `contact.html` pointe vers « Main é merveille - Tapissier d'ameublement ».
      Remplacer la carte (qui suggère un lieu d'accueil) par la liste des communes desservies.
- [ ] Page « Services » détaillée (réfection traditionnelle / mousse, tissus, délais, devis).
- [ ] Section avis clients / FAQ (données structurées `FAQPage`).
- [ ] Lier la fiche Google Business Profile.

## Phase 4 — Accessibilité, RGPD, qualité
- [ ] RGPD : GTM sans bandeau de consentement. Ajouter un bandeau (ex. tarteaucitron)
      ou passer à une mesure d'audience sans cookie.
- [ ] Réécrire la politique de confidentialité : texte générique qui cite newsletter,
      formulaire et achats (inexistants) mais pas les cookies Google ; hébergeur OVH à mentionner.
- [ ] Menu mobile et modales utilisables au clavier (`<button>`, `Échap`, focus piégé, `aria-*`).
- [ ] « Mes services » : `<a onclick>` sans `href` → lien `#prestations` réel.
- [ ] Iframe Google Maps : `title`, chargement au clic (performance + cookies tiers).
- [ ] Remplacer les icônes PNG (tel, mail, réseaux) par des SVG inline.
- [ ] © de l'année générée automatiquement.
- [ ] Prettier + html-validate en `npm run lint`.

## Phase 5 — Outillage IA (après la phase 2)
- [ ] Mettre à jour `CLAUDE.md` (nouvelle structure, commandes) et `docs/CONTENU.md`.
- [ ] Skills `.claude/skills/` : `ajout-realisation`, `ajout-produit`, `produit-vendu`
      (optimise les images, ajoute l'entrée YAML, lance le build).
- [ ] `llms.txt` à la racine du site : résumé de l'activité pour les assistants IA de recherche.
