import Image from '@11ty/eleventy-img';
import { load as loadYaml } from 'js-yaml';

const OUTPUT_DIR = '_site';

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension('yml', (contents) => loadYaml(contents));

  eleventyConfig.addPassthroughCopy({
    'src/css': 'css',
    'src/js': 'js',
    'src/resources': 'resources',
    'src/robots.txt': 'robots.txt',
  });

  const slugify = eleventyConfig.getFilter('slugify');
  // Une seule définition de l'URL d'un produit (liste + page produit)
  eleventyConfig.addFilter('produitUrl', (produit) => `/vente/${produit.id}-${slugify(produit.nom)}.html`);

  // Échappe le texte puis conserve les retours à la ligne
  eleventyConfig.addFilter('nl2br', (text = '') => String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>'));

  // Vignette responsive : génère plusieurs largeurs dans /img/ et un <img srcset> avec width/height
  eleventyConfig.addAsyncShortcode('image', async (src, alt, sizes, attributes = {}) => {
    const metadata = await Image(`src/resources/${src}`, {
      widths: [400, 800, 1200],
      formats: ['webp'],
      outputDir: `${OUTPUT_DIR}/img/`,
      urlPath: '/img/',
    });
    return Image.generateHTML(metadata, { alt, sizes, loading: 'lazy', decoding: 'async', ...attributes });
  });

  eleventyConfig.addGlobalData('layout', 'layouts/base.njk');
  eleventyConfig.addGlobalData('annee', () => new Date().getFullYear());
}

export const config = {
  dir: { input: 'src', output: OUTPUT_DIR },
  htmlTemplateEngine: 'njk',
  markdownTemplateEngine: 'njk',
};
