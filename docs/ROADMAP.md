# Plan d'amélioration

Audit du 25/10/2026. Cocher `[x]` au fur et à mesure. Une phase = une branche / une PR.

## Décisions
- Hébergement OVH, publié automatiquement depuis la branche `main` du dépôt GitHub
  `bixboy/siteMaman` (OVH copie les fichiers tels quels, **sans étape de build**).
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
- [ ] Vérifier visuellement toutes les pages (nouvelles polices + animations) avant de publier.

## Phase 1 — Performance (gain le plus visible)
`resources/` pèse 124 Mo ; les photos font 2 à 8 Mo. L'accueil charge ~8 Mo d'images
(`Background1.webp` 2,1 Mo + `Siege7.webp` 5,5 Mo), énorme sur mobile.
- [ ] Script `scripts/optimize-images.mjs` (sharp) : max 2000 px, WebP q≈75, cible < 300 Ko.
      Gain attendu : 124 Mo → ~5 Mo.
- [ ] Renommer en minuscules sans espaces (`Siege bergere.PNG`, `FauteauilBergere2.jpg`…).
- [ ] Galerie : `srcset="x.webp"` sans descripteur est utilisé comme `src` → corriger.
- [ ] `width`/`height` sur toutes les `<img>` (évite les sauts de mise en page),
      `loading="lazy"` partout sauf l'image du haut, `fetchpriority="high"` sur celle-ci.
- [ ] Mesurer avant/après avec PageSpeed Insights (mobile) et noter les scores ici.

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
