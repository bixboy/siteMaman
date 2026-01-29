# Guide : Ajouter une nouvelle réalisation

Ce guide explique comment ajouter de nouvelles images sur la page **Réalisations** du site.

---

## 1. Préparation
Avant tout, déposez vos images dans le dossier :
`c:\Apps\VScode\siteMaman\resources\Realisations\`

---

## 2. Ajouter une Image Simple

Pour ajouter une simple photo qui s'agrandit au clic :

1.  Ouvrez le fichier `realisations.html`.
2.  Allez à la fin de la liste des réalisations (cherchez `<div class="container-center" id="containerSieges">`).
3.  Ajoutez ce code juste avant la fin du conteneur :

```html
<div class="modal-trigger2">
  <span>Cliquer pour voir</span>
  <!-- Remplacez 'NOM_IMAGE.jpg' par le nom de votre fichier -->
  <img class="myImg2 gallery-img" src="resources/Realisations/NOM_IMAGE.jpg" alt="Description">
</div>
```

---

## 3. Ajouter un Slider Avant/Après

Pour un affichage comparatif "Avant/Après", c'est maintenant très simple :

1.  Ouvrez le fichier `realisations.html`.
2.  Ajoutez ce bloc de code :

```html
<div class="modal-trigger1" 
     data-before="resources/Realisations/IMAGE_AVANT.jpg" 
     data-after="resources/Realisations/IMAGE_APRES.jpg">
  
  <span>Cliquer pour voir</span>
  <!-- Cette image est la vignette visible sur la page -->
  <img class="myImg gallery-img" src="resources/Realisations/IMAGE_APRES.jpg" alt="Description">
  
</div>
```

**Explications :**
*   `data-before` : Chemin de l'image "Avant".
*   `data-after` : Chemin de l'image "Après".
*   La balise `<img>` sert uniquement à l'affichage de la vignette dans la grille.

**C'est tout ! Pas besoin de toucher au CSS.**
