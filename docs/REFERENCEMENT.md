# Référencement : être trouvée sur Google, Bing et par les assistants IA

Le site est prêt (contenu, données structurées, vitesse, `llms.txt`, IndexNow). Mais pour une artisane locale,
**la majorité des clients viennent de Google Maps et des avis** : ces actions hors du site comptent autant
que le site lui-même. À faire dans l'ordre.

## Constat du 25/10/2026 (avant publication de la nouvelle version)
- Bing n'a indexé aucune page de main-e-merveille.fr → invisible pour ChatGPT, Copilot et une partie de Perplexity.
- Une recherche IA sur « Main é Merveille tapissier Caen » ne trouve pas l'entreprise ; d'autres tapissiers
  de Caen et du Calvados apparaissent à sa place.
- Fiche Google Maps : 5 étoiles, **1 seul avis**.

## 1. Juste après la publication (1 heure, une fois)
- [ ] **Google Search Console** (search.google.com/search-console) : ajouter le domaine
      `main-e-merveille.fr`, valider (enregistrement DNS chez OVH), puis Sitemaps → `sitemap.xml`.
- [ ] **Bing Webmaster Tools** (bing.com/webmasters) : « Importer depuis Google Search Console » (2 clics).
      Bing alimente ChatGPT et Copilot. IndexNow lui signale ensuite chaque publication automatiquement.
- [ ] Tester les données structurées : search.google.com/test/rich-results sur l'accueil et `/services.html`.

## 2. Fiche Google Business (le plus important pour « tapissier Caen »)
- [ ] Vérifier que https://www.google.com/maps?cid=623214297286068827 est bien la fiche.
- [ ] Catégorie principale **Tapissier** ; secondaires : Restauration de meubles, Magasin de meubles anciens (vente).
- [ ] **Zone desservie** (adresse masquée) : Caen + communes du Calvados ; horaires ; site web ; téléphone.
- [ ] Services : Restauration de fauteuils, de chaises, de canapés, Réfection de sièges, Coussins.
- [ ] Description reprenant les mots des clients : « refaire / retapisser / recouvrir un fauteuil »,
      « changer le tissu », « restauration de sièges anciens », « à domicile dans le Calvados ».
- [ ] **Photos** : ajouter les avant/après (une ou deux par mois : Google favorise les fiches actives).
- [ ] **Avis** : demander à **chaque** client un avis Google (lien « Demander des avis » de la fiche,
      par SMS après la livraison). Objectif : 10 avis, puis régulier. Répondre à chaque avis.

## 3. Présence ailleurs (mêmes nom, téléphone, ville partout)
- [ ] PagesJaunes (fiche gratuite), Mappy, Apple Plans (Apple Business Connect).
- [ ] Annuaire de la Chambre de métiers et de l'artisanat de Normandie ; Houzz (profil pro).
- [ ] Facebook : renseigner le site web, publier les avant/après avec les mêmes mots-clés.
- [ ] Presse locale : Ouest-France, Tendance Ouest et Liberté Caen font régulièrement des portraits
      d'artisans tapissiers ; un article apporte des liens et de la notoriété.

## 4. Faire vivre le site (une réalisation par mois suffit)
- Ajouter les réalisations récentes (`/ajout-realisation`) avec une description précise (type de siège,
  tissu) : chaque photo légendée est une porte d'entrée de plus sur Google Images et dans les IA.
- Enrichir la FAQ (`src/_data/faq.yml`) avec les vraies questions des clients.

## Ce qui est fait sur le site
- Page `/services.html` en langage courant + lexique (mots du public ↔ termes du métier), communes desservies, FAQ.
- Titres, descriptions, Open Graph, `<h1>` par page ; légendes visibles sous les réalisations.
- Données structurées : LocalBusiness (zone de service, communes, catalogue de services), FAQPage, fil d'Ariane.
- `sitemap.xml` (toutes les pages), `robots.txt` ouvert aux moteurs et aux robots des IA, `llms.txt`.
- Redirection unique vers `https://www.`, site rapide (Lighthouse 97/100/100), IndexNow après chaque publication.
