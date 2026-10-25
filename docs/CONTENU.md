# Ajouter du contenu

Avant tout : optimiser les photos (WebP, ≤ 2000 px de large, < 400 Ko) et les nommer
en minuscules sans espaces ni accents.

## Réalisation (`realisations.html`)

Photos dans `resources/Realisations/`. Ajouter le bloc à la fin de
`<div class="container-center" id="containerSieges">`.

Avant/après (le curseur de comparaison s'ouvre au clic) :

```html
<div class="modal-trigger1"
     data-before="resources/Realisations/NOM-avant.webp"
     data-after="resources/Realisations/NOM-apres.webp">
  <span>Cliquer pour voir</span>
  <img class="myImg gallery-img" src="resources/Realisations/NOM-apres.webp"
       alt="Bergère Louis XV après réfection, velours vert" loading="lazy">
</div>
```

Photo simple (agrandie au clic) :

```html
<div class="modal-trigger2">
  <span>Cliquer pour voir</span>
  <img class="myImg2 gallery-img" src="resources/Realisations/NOM.webp"
       alt="Description de la photo" loading="lazy">
</div>
```

Classe de la vignette : `gallery-img` (cadrage standard) ou `gallery-img-full` (photo en hauteur).

## Produit à vendre (`market.html`)

Photos dans `resources/Produits/`. Ajouter le bloc dans `<div class="product-list" id="listProduct">`.

```html
<div class="product-item category1" data-id="12" data-name="Fauteuil cabriolet"
  data-state="Fauteuil Prêt\n à l'Emploi"
  data-description="Ligne 1.\nLigne 2."
  data-images='["resources/Produits/cabriolet-1.webp", "resources/Produits/cabriolet-2.webp"]'>
  <a class="image-container">
    <img src="resources/Produits/cabriolet-1.webp" alt="Fauteuil cabriolet" loading="lazy">
    <div class="overlay">Fauteuil cabriolet</div>
  </a>
  <h2 class="product-name-mobile">Fauteuil cabriolet</h2>
  <a href="product.html" class="view-details">Voir les détails</a>
</div>
```

- Catégorie (classe) : `category1` = restauré, prêt à l'emploi ; `category2` = à rénover / personnaliser.
- `data-state` : `Fauteuil Prêt\n à l'Emploi` (category1) ou `Fauteuil\n à Personnaliser` (category2).
- `data-id` : prendre le plus grand id existant + 1.
- `\n` dans `data-state` / `data-description` = retour à la ligne sur la fiche produit.
- `data-images` : JSON valide (guillemets doubles), la première image est la vignette.
- Produit vendu : supprimer le bloc (et ses images si elles ne servent plus ailleurs).
