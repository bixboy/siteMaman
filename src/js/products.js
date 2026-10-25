// --- Page Vente : filtre par état (data-filter / data-etat) ---
export function initProductFilters() {
  const buttons = document.querySelectorAll('.category-filter button');
  const products = document.querySelectorAll('.product-item');
  const loader = document.getElementById('loader');
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      if (loader) loader.style.display = 'flex';

      setTimeout(() => {
        products.forEach((product) => {
          product.style.display = filter === 'all' || product.dataset.etat === filter ? 'flex' : 'none';
        });
        if (loader) loader.style.display = 'none';
      }, 500);
    });
  });
}

// --- Page produit : défilement des photos ---
export function initProductGallery() {
  const images = document.querySelectorAll('.ImgSlider');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  if (images.length === 0) return;

  let currentIndex = 0;
  const showImage = (index) => {
    images.forEach((img, i) => img.classList.toggle('active', i === index));
  };

  if (prevButton && nextButton) {
    const display = images.length > 1 ? 'flex' : 'none';
    prevButton.style.display = display;
    nextButton.style.display = display;

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    });
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    });
  }

  showImage(0);
}
