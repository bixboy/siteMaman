import { HtmlBasePlugin } from '@11ty/eleventy';
import { load as loadYaml } from 'js-yaml';
import { generateHTML, imageResponsive, OUTPUT_DIR } from './lib/images.js';

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension('yml', (contents) => loadYaml(contents));

  // Aperçu de test (GitHub Pages, sous /siteMaman/) : `APERCU=1 eleventy --pathprefix=/siteMaman/`.
  // Le plugin préfixe les href/src/srcset du HTML ; les attributs data-* passent par le filtre `url`.
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addGlobalData('apercu', process.env.APERCU === '1');

  eleventyConfig.addPassthroughCopy({
    'src/css': 'css',
    'src/js': 'js',
    'src/resources': 'resources',
    'src/robots.txt': 'robots.txt',
    'src/.htaccess': '.htaccess',
  });

  // Polices auto-hébergées : uniquement les fichiers déclarés dans src/css/polices.css
  const polices = {
    'cormorant-garamond': ['500-normal', '600-normal', '500-italic'],
    cinzel: ['500-normal', '600-normal'],
    'source-sans-3': ['400-normal', '600-normal'],
  };
  for (const [famille, variantes] of Object.entries(polices)) {
    for (const variante of variantes) {
      const fichier = `${famille}-latin-${variante}.woff2`;
      eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/${famille}/files/${fichier}`]: `fonts/${fichier}` });
    }
  }

  const slugify = eleventyConfig.getFilter('slugify');
  // Une seule définition de l'URL d'un produit (liste + page produit)
  eleventyConfig.addFilter('produitUrl', (produit) => `/vente/${produit.id}-${slugify(produit.nom)}.html`);

  // Texte sur une seule ligne (balises meta)
  const uneLigne = (text = '') => String(text).replace(/\s+/g, ' ').trim();
  eleventyConfig.addFilter('uneLigne', uneLigne);

  // Données structurées de l'entreprise (toutes les pages) : zone de service, sans adresse d'accueil
  eleventyConfig.addFilter('entrepriseJsonLd', (site, services) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#entreprise`,
    name: site.nom,
    description: uneLigne(site.description),
    url: `${site.url}/`,
    image: site.url + site.image,
    telephone: site.telephone,
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: site.ville, postalCode: site.codePostal, addressCountry: 'FR' },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Calvados' },
      ...site.communes.map((name) => ({ '@type': 'City', name })),
    ],
    knowsAbout: ['Tapisserie d\'ameublement', 'Réfection de sièges', 'Restauration de fauteuils anciens',
      'Garnissage', 'Couverture de sièges'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Restauration de sièges',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.titre, description: uneLigne(service.texte) },
      })),
    },
    hasMap: site.googleMaps,
    sameAs: [site.facebook, site.googleMaps],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: site.horaires.jours,
      opens: site.horaires.ouverture,
      closes: site.horaires.fermeture,
    },
  }));

  // Données structurées FAQPage à partir de src/_data/faq.yml
  eleventyConfig.addFilter('faqJsonLd', (faq) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, reponse }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: uneLigne(reponse) },
    })),
  }));

  // Échappe le texte puis conserve les retours à la ligne
  eleventyConfig.addFilter('nl2br', (text = '') => String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>'));

  // Vignette responsive : génère plusieurs largeurs dans /img/ et un <img srcset> avec width/height
  eleventyConfig.addAsyncShortcode('image', async (src, alt, sizes, attributes = {}) => {
    const metadata = await imageResponsive(src);
    return generateHTML(metadata, { alt, sizes, loading: 'lazy', decoding: 'async', ...attributes });
  });

  eleventyConfig.addGlobalData('layout', 'layouts/base.njk');
  eleventyConfig.addGlobalData('annee', () => new Date().getFullYear());
}

export const config = {
  dir: { input: 'src', output: OUTPUT_DIR },
  htmlTemplateEngine: 'njk',
  markdownTemplateEngine: 'njk',
};
