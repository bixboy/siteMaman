---
name: ajout-realisation
description: Ajouter une réalisation (avant/après ou photo simple) à la galerie du site. À utiliser dès que l'utilisateur fournit des photos d'un siège restauré ou demande d'ajouter une réalisation.
---

# Ajouter une réalisation

Entrées attendues : chemin(s) des photos ; avant/après (2 photos) ou photo simple (1) ; description si connue.
Demander seulement ce qui manque.

1. Choisir un nom court en minuscules (ex. `bergere-velours-vert`) et copier les photos dans
   `src/resources/Realisations/` : `<nom>-avant.<ext>` + `<nom>-apres.<ext>`, ou `<nom>.<ext>`.
2. `npm run images` : convertit en WebP et affiche les noms finaux (`.webp`).
3. Rédiger `alt` en regardant la photo « après » (outil Read, une seule image) : type de siège, tissu, couleur ;
   moins de 110 caractères ; ne rien inventer (pas de style d'époque incertain).
4. Ajouter le bloc **en tête** de `src/_data/realisations.yml` (les 4 premiers apparaissent sur l'accueil),
   sauf demande contraire :

   ```yaml
   - avant: Realisations/<nom>-avant.webp
     apres: Realisations/<nom>-apres.webp
     alt: Bergère en bois sculpté, velours vert
   ```

   Photo simple : `- photo: Realisations/<nom>.webp` + `alt`.
5. `npm test` doit finir par « tests OK ».
6. Commit sur `Work` (« Réalisation : <alt abrégé> ») puis push : l'aperçu
   https://bixboy.github.io/siteMaman/realisations.html se met à jour en ~2 min. Ne pas publier sur `main`
   (skill `publier`).
