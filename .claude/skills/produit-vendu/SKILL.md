---
name: produit-vendu
description: Retirer de la vente un fauteuil vendu (page « Fauteuils à vendre » et sa fiche produit). À utiliser quand l'utilisateur indique qu'un produit est vendu ou n'est plus disponible.
---

# Retirer un produit vendu

1. Trouver le produit dans `src/_data/produits.yml` (par nom ou id ; si plusieurs correspondent, demander).
2. Demander si le fauteuil doit rejoindre la galerie des réalisations (photo simple, skill `ajout-realisation`)
   avant de supprimer ses photos.
3. Supprimer son bloc YAML. Ne jamais réattribuer son `id`.
4. Pour chaque photo du produit : si elle n'est plus référencée nulle part dans `src/` (Grep sur le nom de
   fichier), la supprimer avec `git rm`.
5. `npm test` doit finir par « tests OK » (sa fiche `/vente/<id>-….html` n'est plus générée).
6. Commit sur `Work` (« Vendu : <nom> ») puis push → aperçu. Ne pas publier sur `main` (skill `publier`).
