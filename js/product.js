(function () {
  const DEFAULT_FALLBACK_IMAGE = 'recources/Produits/fauteuil3.jpg';

  function readProductFromStorage() {
    try {
      const raw = localStorage.getItem('product');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Impossible de lire le produit depuis le stockage.', error);
      return null;
    }
  }

  function formatMultilineText(text) {
    return (text || '').replace(/\n/g, '<br>');
  }

  function renderProductDetails(product) {
    const nameElement = document.getElementById('product-name');
    const stateElement = document.getElementById('product-state');
    const descriptionElement = document.getElementById('product-description');

    if (nameElement) {
      nameElement.textContent = product.name || 'Produit disponible';
    }

    if (stateElement) {
      stateElement.innerHTML = formatMultilineText(product.state || '');
    }

    if (descriptionElement) {
      descriptionElement.innerHTML = formatMultilineText(product.description || '');
    }
  }

  function createImageElement(src, alt, index) {
    const image = document.createElement('img');
    image.src = src;
    image.alt = `${alt} - Image ${index + 1}`;
    image.loading = 'lazy';
    image.dataset.index = String(index);
    return image;
  }

  function initModal(sliderImages) {
    const modal = document.getElementById('myModalIMG');
    const modalImage = document.getElementById('image');
    const modalCaption = document.getElementById('productModalCaption');
    const closeButton = modal?.querySelector('.modal__close');

    if (!modal || !modalImage) {
      return;
    }

    const openModal = (image) => {
      modalImage.src = image.src;
      modalImage.alt = image.alt;

      if (modalCaption) {
        modalCaption.textContent = image.alt;
      }

      Site.openModal(modal);
    };

    sliderImages.forEach((image) => {
      image.addEventListener('click', () => openModal(image));
    });

    closeButton?.addEventListener('click', () => Site.closeModal(modal));

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        Site.closeModal(modal);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('modal--visible')) {
        Site.closeModal(modal);
      }
    });
  }

  function initSlider(images, productName) {
    const slider = document.querySelector('.sliderProduct');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (!slider) {
      return;
    }

    slider.innerHTML = '';

    const imageList = images && images.length ? images : [DEFAULT_FALLBACK_IMAGE];

    const sliderImages = imageList.map((src, index) => {
      const image = createImageElement(src, productName || 'Produit', index);
      slider.appendChild(image);
      return image;
    });

    if (!sliderImages.length) {
      return;
    }

    let currentIndex = 0;

    const updateActiveImage = (index) => {
      sliderImages.forEach((image, i) => {
        if (i === index) {
          image.classList.add('active');
        } else {
          image.classList.remove('active');
        }
      });
    };

    const showNextImage = () => {
      currentIndex = (currentIndex + 1) % sliderImages.length;
      updateActiveImage(currentIndex);
    };

    const showPreviousImage = () => {
      currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
      updateActiveImage(currentIndex);
    };

    updateActiveImage(currentIndex);

    if (sliderImages.length <= 1) {
      if (prevButton) {
        prevButton.style.display = 'none';
      }
      if (nextButton) {
        nextButton.style.display = 'none';
      }
    } else {
      prevButton?.addEventListener('click', showPreviousImage);
      nextButton?.addEventListener('click', showNextImage);
    }

    initModal(sliderImages);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const product = readProductFromStorage();

    if (!product) {
      console.warn('Aucun produit trouvé dans le stockage local.');
      initSlider([], 'Produit');
      return;
    }

    renderProductDetails(product);
    initSlider(Array.isArray(product.images) ? product.images : [], product.name);
  });
})();
