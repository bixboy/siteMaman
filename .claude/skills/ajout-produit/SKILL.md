---
name: ajout-produit
description: Mettre en vente un fauteuil ou un siège sur la page « Fauteuils à vendre » (crée aussi sa fiche produit). À utiliser quand l'utilisateur veut ajouter un produit à vendre.
---

# Ajouter un produit à vendre

Entrées attendues : photos (la première = vignette), nom, état (`restaure` = prêt à l'emploi,
`a-renover` = à personnaliser), description. Demander seulement ce qui manque ; ne pas inventer la description.

1. Nom de fichier court en minuscules (ex. `cabriolet-lin`) ; copier les photos dans `src/resources/Produits/`
   en `<nom>-1.<ext>`, `<nom>-2.<ext>`…
2. `npm run images` : noter les noms finaux (`.webp`).
3. `id` = plus grand `id` de `src/_data/produits.yml` + 1 (jamais réutiliser un id, même d'un produit vendu).
4. Ajouter le bloc en tête de `src/_data/produits.yml` (sauf demande contraire) :

   ```yaml
   - id: 13
     nom: Fauteuil cabriolet
     etat: restaure
     description: |-
       Fauteuil cabriolet Louis XV.
       Tissu lin naturel.
     photos:
       - Produits/cabriolet-lin-1.webp
       - Produits/cabriolet-lin-2.webp
   ```

5. `npm test` doit finir par « tests OK » ; la fiche est générée en `/vente/<id>-<nom-slugifié>.html`.
6. Commit sur `Work` (« Vente : <nom> ») puis push → aperçu https://bixboy.github.io/siteMaman/market.html.
   Ne pas publier sur `main` (skill `publier`).
