(function () {
  function handleProductLinks() {
    const productLinks = document.querySelectorAll('.view-details');

    if (!productLinks.length) {
      return;
    }

    productLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();

        const productItem = link.closest('.product-item');

        if (!productItem) {
          return;
        }

        const product = {
          id: productItem.getAttribute('data-id'),
          name: productItem.getAttribute('data-name'),
          state: productItem.getAttribute('data-state'),
          description: productItem.getAttribute('data-description'),
          images: JSON.parse(productItem.getAttribute('data-images') || '[]')
        };

        localStorage.setItem('product', JSON.stringify(product));
        window.location.href = 'product.html';
      });
    });
  }

  function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.category-filter button');
    const products = document.querySelectorAll('.product-item');
    const loader = document.getElementById('loader');

    if (!filterButtons.length || !products.length || !loader) {
      return;
    }

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        loader.style.display = 'flex';

        window.setTimeout(() => {
          products.forEach((product) => {
            const shouldShow = filter === 'all' || product.classList.contains(filter);
            product.style.display = shouldShow ? 'flex' : 'none';
          });

          loader.style.display = 'none';
        }, 500);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    handleProductLinks();
    initCategoryFilter();
  });
})();
