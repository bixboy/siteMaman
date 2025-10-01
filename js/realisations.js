(function () {
  const DEFAULT_LABEL = 'Cliquer pour voir';
  const galleryContainer = document.getElementById('containerSieges');
  const comparisonModal = document.getElementById('comparisonModal');
  const comparisonClose = comparisonModal?.querySelector('.modal__close');
  const sliderBefore = comparisonModal?.querySelector('.slider__before');
  const sliderAfter = comparisonModal?.querySelector('.slider__after');
  const sliderRange = comparisonModal?.querySelector('.slider__range');
  const sliderSeparator = comparisonModal?.querySelector('.slider__separator');
  const comparisonCaption = comparisonModal?.querySelector('#comparisonCaption');

  const imageModal = document.getElementById('imageModal');
  const imageClose = imageModal?.querySelector('.modal__close');
  const imageContent = document.getElementById('imageModalContent');
  const imageCaption = document.getElementById('imageCaption');

  const galleryItems = [
    {
      type: 'comparison',
      id: 'siege1',
      alt: 'Fauteuil médaillon rénové',
      before: 'recources/Realisations/Siege1.3.webp',
      after: 'recources/Realisations/siege1.4.webp',
      thumbnail: 'recources/Realisations/siege1.4.webp',
      caption: 'Fauteuil médaillon rénové',
      thumbnailStyle: { height: '34vh' }
    },
    {
      type: 'comparison',
      id: 'siege2',
      alt: 'Fauteuil à crosses modernisé',
      before: 'recources/Realisations/Siege2.webp',
      after: 'recources/Realisations/Siege2.1.webp',
      thumbnail: 'recources/Realisations/Siege2.1.webp',
      caption: 'Fauteuil à crosses modernisé'
    },
    {
      type: 'comparison',
      id: 'siege3',
      alt: 'Fauteuil crapaud avant / après',
      before: 'recources/Realisations/Siege3.webp',
      after: 'recources/Realisations/siege3.1.webp',
      thumbnail: 'recources/Realisations/siege3.1.webp',
      caption: 'Fauteuil crapaud avant / après'
    },
    {
      type: 'comparison',
      id: 'siege4',
      alt: 'Fauteuil à motifs relooké',
      before: 'recources/Realisations/Siege4.webp',
      after: 'recources/Realisations/Siege4.1.webp',
      thumbnail: 'recources/Realisations/Siege4.1.webp',
      caption: 'Fauteuil à motifs relooké'
    },
    {
      type: 'comparison',
      id: 'siege6',
      alt: 'Fauteuil cabriolet retapissé',
      before: 'recources/Realisations/Siege6.1.webp',
      after: 'recources/Realisations/Siege6.webp',
      thumbnail: 'recources/Realisations/Siege6.webp',
      caption: 'Fauteuil cabriolet retapissé'
    },
    {
      type: 'comparison',
      id: 'siege7',
      alt: 'Fauteuil médaillon fleuri',
      before: 'recources/Realisations/Siege7.1.webp',
      after: 'recources/Realisations/Siege7.webp',
      thumbnail: 'recources/Realisations/Siege7.webp',
      caption: 'Fauteuil médaillon fleuri'
    },
    {
      type: 'comparison',
      id: 'siege11',
      alt: 'Banquette capitonnée restaurée',
      before: 'recources/Realisations/Siege11.jpg',
      after: 'recources/Realisations/Siege11.1.jpg',
      thumbnail: 'recources/Realisations/Siege11.1.jpg',
      caption: 'Banquette capitonnée restaurée'
    },
    {
      type: 'image',
      id: 'siege5',
      alt: 'Fauteuil cannage et velours',
      src: 'recources/Realisations/Siege5.webp',
      caption: 'Fauteuil cannage et velours'
    },
    {
      type: 'comparison',
      id: 'siege12',
      alt: 'Chaise contemporaine retapissée',
      before: 'recources/Realisations/Siege12.jpg',
      after: 'recources/Realisations/Siege12.1.jpg',
      thumbnail: 'recources/Realisations/Siege12.1.jpg',
      caption: 'Chaise contemporaine retapissée'
    },
    {
      type: 'image',
      id: 'coussins1',
      alt: 'Coussins sur mesure',
      src: 'recources/Realisations/Coussins1.webp',
      caption: 'Coussins sur mesure'
    },
    {
      type: 'comparison',
      id: 'siege13',
      alt: 'Fauteuil dossier haut rénové',
      before: 'recources/Realisations/siege13.1.webp',
      after: 'recources/Realisations/siege13.webp',
      thumbnail: 'recources/Realisations/siege13.webp',
      caption: 'Fauteuil dossier haut rénové'
    },
    {
      type: 'comparison',
      id: 'siege14',
      alt: 'Fauteuil Louis XVI revisité',
      before: 'recources/Realisations/Siege14.webp',
      after: 'recources/Realisations/Siege14.1.webp',
      thumbnail: 'recources/Realisations/Siege14.1.webp',
      caption: 'Fauteuil Louis XVI revisité'
    },
    {
      type: 'image',
      id: 'coussins2',
      alt: 'Coussins décoratifs assortis',
      src: 'recources/Realisations/Coussins2.webp',
      caption: 'Coussins décoratifs assortis'
    },
    {
      type: 'comparison',
      id: 'siege15',
      alt: 'Fauteuil médaillon bicolore',
      before: 'recources/Realisations/Siege15.webp',
      after: 'recources/Realisations/Siege15.1.webp',
      thumbnail: 'recources/Realisations/Siege15.1.webp',
      caption: 'Fauteuil médaillon bicolore'
    }
  ];

  function applyThumbnailStyle(image, style) {
    if (!style) {
      return;
    }

    Object.entries(style).forEach(([property, value]) => {
      if (value !== undefined && value !== null) {
        image.style[property] = value;
      }
    });
  }

  function createGalleryCard(item) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-card';
    button.setAttribute('aria-label', `${DEFAULT_LABEL} – ${item.alt}`);

    const img = document.createElement('img');
    img.className = 'gallery-card__image';
    img.src = item.thumbnail || item.src;
    img.alt = item.alt;
    img.loading = 'lazy';

    applyThumbnailStyle(img, item.thumbnailStyle);

    const label = document.createElement('span');
    label.className = 'gallery-card__label';
    label.textContent = DEFAULT_LABEL;

    button.append(img, label);
    button.dataset.itemId = item.id;
    button.dataset.itemType = item.type;

    return button;
  }

  function renderGallery() {
    if (!galleryContainer) {
      return;
    }

    galleryContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();

    galleryItems.forEach((item) => {
      fragment.appendChild(createGalleryCard(item));
    });

    galleryContainer.appendChild(fragment);
  }

  function resetSlider() {
    if (!sliderBefore || !sliderSeparator) {
      return;
    }

    sliderBefore.style.width = '50%';
    sliderSeparator.style.left = '50%';

    if (sliderRange) {
      sliderRange.value = '50';
    }
  }

  function openComparison(item) {
    if (!comparisonModal || !sliderBefore || !sliderAfter) {
      return;
    }

    sliderBefore.style.backgroundImage = `url(${item.before})`;
    sliderAfter.style.backgroundImage = `url(${item.after})`;
    sliderBefore.setAttribute('aria-label', `Avant - ${item.alt}`);
    sliderAfter.setAttribute('aria-label', `Après - ${item.alt}`);

    if (comparisonCaption) {
      comparisonCaption.textContent = item.caption || item.alt;
    }

    resetSlider();
    Site.openModal(comparisonModal);
  }

  function openImage(item) {
    if (!imageModal || !imageContent) {
      return;
    }

    imageContent.src = item.src;
    imageContent.alt = item.alt;

    if (imageCaption) {
      imageCaption.textContent = item.caption || item.alt;
    }

    Site.openModal(imageModal);
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }

    Site.closeModal(modal);
  }

  function bindGalleryEvents() {
    if (!galleryContainer) {
      return;
    }

    galleryContainer.addEventListener('click', (event) => {
      const card = event.target.closest('.gallery-card');

      if (!card) {
        return;
      }

      const itemId = card.dataset.itemId;
      const item = galleryItems.find((galleryItem) => galleryItem.id === itemId);

      if (!item) {
        return;
      }

      if (item.type === 'comparison') {
        openComparison(item);
      } else {
        openImage(item);
      }
    });
  }

  function setupModalInteractions() {
    if (comparisonModal) {
      comparisonModal.addEventListener('click', (event) => {
        if (event.target === comparisonModal) {
          closeModal(comparisonModal);
        }
      });

      comparisonClose?.addEventListener('click', () => closeModal(comparisonModal));
    }

    if (imageModal) {
      imageModal.addEventListener('click', (event) => {
        if (event.target === imageModal) {
          closeModal(imageModal);
        }
      });

      imageClose?.addEventListener('click', () => closeModal(imageModal));
    }

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (comparisonModal?.classList.contains('modal--visible')) {
        closeModal(comparisonModal);
      }

      if (imageModal?.classList.contains('modal--visible')) {
        closeModal(imageModal);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    bindGalleryEvents();
    setupModalInteractions();
  });
})();
