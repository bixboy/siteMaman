# Main é merveille — Site vitrine

Projet Astro statique pour l'atelier de tapisserie d'ameublement **Main é merveille**. L'objectif est de proposer un site rapide, accessible et optimisé SEO avec une structure éditoriale complète (services, réalisations, vente de fauteuils, contact, mentions légales).

## Prérequis

- Node.js >= 18.17
- npm >= 9

## Installation

```bash
npm install
```

## Commandes

| Commande           | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Lance le serveur de développement Astro.      |
| `npm run build`    | Génère le site statique prêt à déployer.      |
| `npm run preview`  | Prévisualise le build statique.               |
| `npm run lint`     | Vérifie le lint des fichiers Astro/TS.        |
| `npm run format`   | Formate le code avec Prettier.                |

## Structure du projet

```
src/
├── components/      # Composants réutilisables (header, cards…)
├── data/            # Contenus structurés (services, projets…)
├── layouts/         # Layouts globaux
├── pages/           # Pages Astro (routes)
├── styles/          # Styles globaux
└── utils/           # Helpers (schema.org…)
public/              # Assets statiques (favicon, manifest…)
```

## Ajouter un nouveau projet

1. Ouvrir `src/data/projects.ts`.
2. Ajouter un objet dans le tableau `projects` avec : `slug`, `title`, `category`, `summary`, `description`, `materials`, `duration`, `techniques`, `beforeImage`, `afterImage`.
3. Les images peuvent être hébergées sur un service externe (Unsplash…) ou déposées dans `public/images` puis référencées via `/images/nom.webp`.
4. Le projet sera automatiquement disponible dans la galerie et une page dédiée sera générée à l'URL `/realisations/<slug>`.

## Ajouter un fauteuil à la vente

1. Modifier `src/data/products.ts`.
2. Ajouter un objet avec `slug`, `name`, `price`, `description`, `dimensions`, `materials`, `status`, `image`.
3. Une carte produit et une page fiche seront générées automatiquement.

## Ajouter un témoignage

1. Mettre à jour `src/data/testimonials.ts`.
2. Ajouter un objet `{ author, context, quote }`.

## Modifier SEO & méta

- Les titres et descriptions sont définis dans chaque page (frontmatter Astro).
- Les données structurées sont gérées dans `src/utils/schema.ts`.
- Pour activer Plausible ou Matomo, compléter `siteConfig.analytics` dans `src/data/site.ts` et renseigner le domaine.

## Local SEO

- Compléter l'adresse, le téléphone, la zone d'intervention et le SIRET dans `src/data/site.ts`. Ces valeurs alimentent les mentions légales, le footer et le schema.org LocalBusiness.

## Formulaire de contact

- Le formulaire (`/contact`) inclut une validation client et un honeypot anti-spam.
- Pour relier à un service d'envoi (Netlify, Formspree, API maison), remplacer le handler JS dans `src/pages/contact.astro` ou connecter l'attribut `action` du formulaire.

## Accessibilité & performances

- Skip-link, navigation clavier, focus visibles, contrastes conformes.
- Images lazy-loaded, polices préchargées via `@fontsource`, JS minimal.
- Lightbox accessible et bandeau cookies RGPD (analytics désactivées par défaut).

## Déploiement

1. Construire le site : `npm run build`.
2. Déployer le dossier `dist/` sur l'hébergement statique de votre choix (Netlify, Vercel, OVH, etc.).
3. Vérifier que `robots.txt` et `sitemap.xml` sont bien accessibles.

## Test d'accessibilité rapide

Liste de contrôle :

- [ ] Navigation clavier possible sur l'ensemble des pages.
- [ ] Attributs `alt` renseignés pour toutes les images.
- [ ] Contrastes AA vérifiés (outil Wave / Lighthouse).
- [ ] Formulaires testés avec lecteur d'écran (labels associés, feedback vocal).

## Sources images placeholders

- Les visuels avant/après et produits proviennent de la librairie libre Unsplash (crédits intégrés via les URLs).

## Personnalisation rapide

- Couleurs : ajuster les variables CSS dans `src/styles/global.css`.
- Typographies : modifier les imports `@fontsource` au même endroit.
- Bouton WhatsApp / téléphone : compléter `whatsapp` ou le téléphone dans `src/data/site.ts` puis ajouter l'appel dans le header/footer si nécessaire.

## Impression des fiches projet

- Les pages `/realisations/<slug>` sont formatées pour l'impression (styles hérités). Pour affiner, ajouter une section `@media print` dans `src/components/LightboxGallery.astro` ou la page projet.

Bon développement !
