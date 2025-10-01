# Refonte Main é Merveille

## Synthèse par page

### Accueil
- Refonte complète de la mise en page avec hero clair, CTA, liste des services et section avant/après.
- Intégration d'une palette artisanale et d'une hiérarchie typographique serif/sans-serif.
- Ajout d'un composant avant/après interactif et d'un encart fournisseurs avec logos existants.

### Services (`/services/`)
- Création d'une page dédiée présentant les méthodes traditionnelle et contemporaine.
- Mise en avant du processus en quatre étapes et d'une FAQ structurée (JSON-LD FAQPage).
- CTA vers le formulaire de contact et vers le catalogue de fauteuils.

### Réalisations
- Galerie responsive avec lightbox accessible et descriptions des projets.
- Ajout d'un slider avant/après et d'un ItemList JSON-LD pour les images clés.
- Nouvelles meta OG/Twitter et fil d'Ariane.

### Vente fauteuils
- Catalogue filtrable (prêt à l'emploi / à personnaliser) avec cartes produit normalisées.
- Stockage des informations produit pour la fiche détail et mise à jour du balisage schema.org.
- Notice sur le fonctionnement des réservations + CTA contact.

### Fiche produit
- Mise en page responsive avec galerie principale + miniatures.
- Génération dynamique du JSON-LD Product selon le fauteuil sélectionné.
- Message de garde lorsque la page est ouverte sans sélection.

### Contact
- Formulaire RGPD complet avec consentement, champ honeypot et timestamp anti-bot.
- Gestion de l'état via messages accessibles et validation côté client.
- Ajout de messages d'erreur personnalisés et accessibles lors de la saisie.
- Section coordonnées, carte intégrée et horaires indicatifs.

### Mentions légales & Politique de confidentialité
- Harmonisation de la structure, mise à jour des contenus et navigation cohérente.

### Composants globaux
- Nouvelle navigation sticky avec bouton accessible, skip-link et footer enrichi.
- Variables CSS centralisées (`css/main.css`) et feuilles par page pour limiter la charge.
- Optimisation des images (lazy loading, dimensions explicites) et métadonnées sociales homogènes.

## Performances & SEO
- Polices chargées en `font-display: swap`, scripts `defer`, suppression des CSS inutilisés.
- Sitemap et robots.txt mis à jour, balises title/meta uniques, Open Graph cohérent.
- JSON-LD : LocalBusiness, Service, FAQPage, ItemList, Product.

## Accessibilité
- Structure sémantique complète (header/nav/main/section/footer).
- États focus visibles, contrôles clavier pour menu, lightbox et sliders.
- Messages de statut ARIA pour le formulaire.

## Points à compléter par l'artisan
- Adresse exacte de l'atelier.
- SIRET et éventuels horaires détaillés.
- Nom / coordonnées de l'hébergeur.

## Check-list Lighthouse

| Catégorie | Objectif | Statut |
| --- | --- | --- |
| Performance | ≥ 90 | À mesurer après déploiement (audit Lighthouse à réaliser en production) |
| Accessibilité | ≥ 90 | À mesurer après déploiement (audit Lighthouse à réaliser en production) |
| Best Practices | ≥ 90 | À mesurer après déploiement (audit Lighthouse à réaliser en production) |
| SEO | ≥ 90 | À mesurer après déploiement (audit Lighthouse à réaliser en production) |

_Remarque : réaliser un audit Lighthouse desktop & mobile une fois le site mis en ligne pour consigner les scores et les conserver dans ce document._
