// Génération des images responsives (plusieurs largeurs WebP dans _site/img/), partagée par le
// shortcode `image` (eleventy.config.js) et l'image du bandeau (src/_data/imageBandeau.js).
import Image from '@11ty/eleventy-img';

export const OUTPUT_DIR = '_site';

// `src` : chemin dans src/resources/ ; renvoie les métadonnées eleventy-img (format webp)
export async function imageResponsive(src, widths = [400, 800, 1200]) {
  const metadata = await Image(`src/resources/${src}`, {
    widths,
    formats: ['webp'],
    outputDir: `${OUTPUT_DIR}/img/`,
    urlPath: '/img/',
  });
  return metadata;
}

export const { generateHTML } = Image;
