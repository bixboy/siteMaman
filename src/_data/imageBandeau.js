// Photo des bandeaux d'en-tête en plusieurs largeurs (partials/bandeau.njk) :
// un mobile charge ~60 Ko au lieu de la photo de 1600 px.
import { imageResponsive } from '../../lib/images.js';

export default async function () {
  const { webp } = await imageResponsive('Realisations/background1.webp', [640, 1024, 1600]);
  const largest = webp.at(-1);
  return {
    src: largest.url,
    srcset: webp.map((variant) => variant.srcset).join(', '),
    width: largest.width,
    height: largest.height,
  };
}
