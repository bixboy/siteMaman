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
  eleventyConfig.addFilter('uneLigne', (text = '') => String(text).replace(/\s+/g, ' ').trim());

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
