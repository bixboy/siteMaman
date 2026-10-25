# Ajouter ou modifier du contenu

Tout le contenu est dans `src/_data/` (fichiers YAML commentés). Le HTML est généré.

## 1. Photos
Déposer les photos (JPEG du téléphone, PNG…) dans `src/resources/Realisations/` ou
`src/resources/Produits/`, puis lancer `npm run images`. Le script convertit en WebP (≤ 1600 px),
normalise le nom (`Fauteuil Bergère.JPG` → `fauteuil-bergere.webp`) et affiche le nom final.
Pour un avant/après, nommer les photos `<nom>-avant` et `<nom>-apres`.

## 2. Réalisation — `src/_data/realisations.yml`
Ajouter un bloc (l'ordre du fichier = l'ordre d'affichage) :

```yaml
- avant: Realisations/bergere-louis-xv-avant.webp
  apres: Realisations/bergere-louis-xv-apres.webp
  alt: Bergère Louis XV refaite en velours vert
```

Photo simple (agrandie au clic) : `- photo: Realisations/coussins3.webp` (+ `alt`).
Les 4 premières réalisations du fichier apparaissent aussi sur la page d'accueil.

## 3. Produit à vendre — `src/_data/produits.yml`

```yaml
- id: 13                  # plus grand id existant + 1, jamais réutilisé
  nom: Fauteuil cabriolet
  etat: restaure          # restaure (prêt à l'emploi) | a-renover (à personnaliser)
  description: |-
    Fauteuil cabriolet Louis XV.
    Tissu lin naturel.
  photos:
    - Produits/cabriolet-1.webp   # la première sert de vignette
    - Produits/cabriolet-2.webp
```

La page `/vente/13-fauteuil-cabriolet.html` est créée automatiquement.
**Produit vendu** : supprimer son bloc (et ses photos si elles ne servent plus).

## 4. Autres
- Téléphone, email, Facebook, horaires, zone d'intervention : `src/_data/site.yml`.
- Cartes « Mes services » : `src/_data/services.yml`. Libellés des états produit : `src/_data/etats.yml`.
- Logos fournisseurs : `src/_data/fournisseurs.yml` (+ logo dans `src/resources/`).
- Textes des pages (à propos, bandeaux…) : directement dans `src/index.njk`, `src/contact/contact.njk`…

## 5. Vérifier et publier
1. `npm run dev` puis ouvrir http://localhost:8080 pour voir le résultat.
2. `npm test` : doit finir par « tests OK ».
3. Commit sur `Work`, puis pour publier : fusionner `Work` dans `main` et pousser `main`.
   Le site est en ligne ~2 minutes plus tard si les tests passent (onglet « Actions » du dépôt GitHub).
