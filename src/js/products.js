// --- Page Vente : filtres par état ([data-filter] → produits [data-etat]) ---
export function initProductFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  const products = document.querySelectorAll('[data-etat]');
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      products.forEach((product) => {
        product.hidden = filter !== 'all' && product.dataset.etat !== filter;
      });
    });
  });
}

// --- Page produit : photo principale, flèches et vignettes ([data-galerie-produit]) ---
export function initProductGallery() {
  const gallery = document.querySelector('[data-galerie-produit]');
  if (!gallery) return;

  const mainImage = gallery.querySelector('[data-photo-principale]');
  const zoomButton = gallery.querySelector('[data-photo]');
  const thumbnails = [...gallery.querySelectorAll('[data-vignette]')];
  if (thumbnails.length < 2) return;

  let index = 0;
  const show = (newIndex) => {
    index = (newIndex + thumbnails.length) % thumbnails.length;
    const { src, alt } = thumbnails[index].dataset;
    mainImage.src = src;
    mainImage.alt = alt;
    zoomButton.dataset.photo = src;
    thumbnails.forEach((thumbnail, i) => thumbnail.setAttribute('aria-current', String(i === index)));
  };

  thumbnails.forEach((thumbnail, i) => thumbnail.addEventListener('click', () => show(i)));
  gallery.querySelector('[data-precedent]')?.addEventListener('click', () => show(index - 1));
  gallery.querySelector('[data-suivant]')?.addEventListener('click', () => show(index + 1));
}
