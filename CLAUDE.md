# Main é Merveille — site vitrine

Site d'une tapissière d'ameublement à Caen (14). Prod : https://www.main-e-merveille.fr
Contenu, commentaires et commits en français.

## Stack
HTML/CSS/JS statiques, sans build. npm ne sert qu'à l'outillage local (`npm install` une fois).
Un seul script côté site : `main.js`
(chaque `initX()` sort immédiatement si ses éléments ne sont pas dans la page).
Analytics : Google Tag Manager `GTM-5QGTNVK7` dans le `<head>` de chaque page.
Hébergement OVH, publié automatiquement depuis GitHub (`bixboy/siteMaman`), sans build :
**un push sur la branche publiée = mise en ligne immédiate**. Branche publiée à confirmer
(voir `docs/ROADMAP.md`) ; ne jamais pousser sur `main` sans accord explicite.
Pas de PHP, pas de formulaire (contact = `mailto:` + téléphone), pas d'Instagram.
Activité à domicile (Caen et Calvados) : pas d'adresse d'atelier, ne jamais en inventer une.

## Carte des fichiers
- `index.html` — accueil : à propos, services (`#prestations`), fournisseurs
- `realisations.html` — galerie : `.modal-trigger1` = avant/après (modale `#myModal`), `.modal-trigger2` = photo simple (`#myModalIMG`)
- `market.html` — produits à vendre ; données dans les attributs `data-*` des `.product-item`
- `product.html` — fiche produit remplie en JS depuis `localStorage` (pas d'URL propre par produit)
- `contact/`, `legal/` — pages en sous-dossier : tous les chemins sont préfixés `../`
- `css/body.css` — variables `:root` (couleurs, polices, espacements), reset, animations
- `css/<page>-components/*.css` — un fichier par section de page
- `resources/` — images WebP : `Realisations/`, `Produits/`, logos et icônes à la racine
- `scripts/optimize-images.mjs` — `npm run images` : convertit/renomme les images et met à jour les chemins
- `docs/` — documentation chargée à la demande (voir plus bas)

## Règles
- Ne pas ouvrir les images de `resources/` sauf demande explicite : s'appuyer sur les noms de fichiers.
- Nav et footer sont copiés dans les 7 pages HTML : toute modif doit être répercutée partout
  (avec `../` dans `contact/` et `legal/`).
- Coordonnées (07 68 31 76 08, mainemerveille@gmail.com) en dur dans toutes les pages
  et dans le JSON-LD de `index.html` : les modifier partout.
- Couleurs, polices, espacements : utiliser les variables de `css/body.css`, jamais de valeur en dur.
- Nouveau code : pas de `style="..."` ni de `onclick` dans le HTML ; écouteurs dans `main.js`.
- Breakpoint mobile : `max-width: 767px` / `min-width: 768px`.
- Nouvelle image : la déposer dans `resources/` puis lancer `npm run images` (WebP, plus grand
  côté ≤ 1600 px, nom normalisé). Ne jamais recompresser une image à la main.
- `<img>` : `alt` descriptif en français, `loading="lazy"` sauf l'image d'en-tête (`fetchpriority="high"`).
- Respecter la casse exacte des noms de fichiers (l'hébergement est sensible à la casse, pas Windows) ;
  renommer avec `git mv`, jamais par l'explorateur.
- Les fichiers sont en CRLF : éviter `sed -i` (convertit en LF), préférer l'outil Edit.

## Documentation
- Ajouter une réalisation ou un produit : `docs/CONTENU.md`
- Plan d'amélioration, bugs connus, avancement : `docs/ROADMAP.md` (cocher les cases une fois fait)

## Vérifier
Pas de tests automatisés. Servir le site en local (`npm run serve`) puis contrôler
la page modifiée en mobile (375 px) et desktop, console navigateur sans erreur.
