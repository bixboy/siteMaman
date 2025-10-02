const siteNav = () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const navWrapper = document.getElementById('navigation');
  if (!toggle || !navWrapper) return;

  const closeNav = () => {
    navWrapper.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openNav = () => {
    navWrapper.dataset.open = 'true';
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = navWrapper.dataset.open === 'true';
    if (isOpen) {
      closeNav();
    } else {
      openNav();
      navWrapper.querySelector('a, button')?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navWrapper.contains(event.target) && !toggle.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
      toggle.focus();
    }
  });
};

const beforeAfterSliders = () => {
  const sliders = document.querySelectorAll('[data-before-after]');
  sliders.forEach((container) => {
    const input = container.querySelector('.before-after__input');
    const slider = container.querySelector('[data-slider]');
    const handle = container.querySelector('.before-after__handle');
    if (!input || !slider || !handle) return;

    const update = (value) => {
      slider.style.setProperty('--value', value);
      handle.style.left = `${value}%`;
    };

    update(input.value);
    input.addEventListener('input', (event) => {
      update(event.target.value);
    });
  });
};

const lightboxGallery = () => {
  const triggers = document.querySelectorAll('[data-lightbox]');
  const modal = document.querySelector('[data-lightbox-modal]');
  if (!triggers.length || !modal) return;

  const image = modal.querySelector('[data-lightbox-image]');
  const caption = modal.querySelector('[data-lightbox-caption]');
  const closeBtn = modal.querySelector('.lightbox__close');

  const close = () => {
    modal.dataset.open = 'false';
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  };

  const open = (src, text, alt) => {
    image.src = src;
    image.alt = alt || text || '';
    caption.textContent = text || '';
    modal.dataset.open = 'true';
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    closeBtn.focus();
  };

  triggers.forEach((button) => {
    button.addEventListener('click', () => {
      const src = button.dataset.lightbox;
      const text = button.dataset.caption || button.querySelector('img')?.alt || '';
      const alt = button.querySelector('img')?.alt || '';
      open(src, text, alt);
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.dataset.open === 'true') {
      close();
    }
  });
};

const productFilters = () => {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('[data-product]'));
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const emptyMessage = document.querySelector('[data-empty-message]');

  const applyFilter = (filter) => {
    let visibleCount = 0;
    cards.forEach((card) => {
      const category = card.dataset.category;
      const matches = filter === 'all' || category === filter;
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      applyFilter(button.dataset.filter);
    });
  });
};

const productStorage = () => {
  const links = document.querySelectorAll('[data-product-link]');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      const card = link.closest('[data-product]');
      if (!card) return;
      try {
        const data = JSON.parse(card.dataset.product);
        localStorage.setItem('selectedProduct', JSON.stringify(data));
      } catch (error) {
        console.error('Impossible d\'enregistrer le produit', error);
      }
    });
  });
};

const productDetail = () => {
  const detailWrapper = document.querySelector('[data-product-detail]');
  if (!detailWrapper) return;

  const schemaScript = document.getElementById('product-schema');
  const mainImage = detailWrapper.querySelector('[data-product-image]');
  const thumbsWrapper = detailWrapper.querySelector('[data-product-thumbs]');
  const title = document.getElementById('product-title');
  const summary = document.getElementById('product-summary');
  const description = document.getElementById('product-description');
  const state = document.getElementById('product-state');
  const warning = document.querySelector('[data-product-warning]');

  let productData = null;
  try {
    const stored = localStorage.getItem('selectedProduct');
    if (stored) {
      productData = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Lecture produit impossible', error);
  }

  if (!productData) {
    if (warning) warning.hidden = false;
    return;
  }

  title.textContent = productData.name;
  summary.textContent = productData.state === 'Prêtes à l\'emploi' ? 'Fauteuil prêt à rejoindre votre intérieur.' : 'Pièce à personnaliser selon vos envies.';
  description.textContent = productData.description;
  state.textContent = productData.state;
  if (warning) warning.hidden = true;

  const images = Array.isArray(productData.images) && productData.images.length ? productData.images : ['recources/Produits/fauteuil1.jpg'];
  const setMainImage = (src, index = 0) => {
    mainImage.src = src;
    mainImage.alt = `${productData.name} - visuel ${index + 1}`;
  };

  setMainImage(images[0], 0);
  if (thumbsWrapper) {
    thumbsWrapper.innerHTML = '';
    images.forEach((src, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      button.innerHTML = `<img src="${src}" alt="${productData.name} - miniature ${index + 1}" loading="lazy" decoding="async">`;
      button.addEventListener('click', () => {
        thumbsWrapper.querySelectorAll('button').forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        setMainImage(src, index);
      });
      thumbsWrapper.appendChild(button);
    });
  }

  if (schemaScript) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.name,
      image: images.map((src) => `https://main-e-merveille.fr/${src}`),
      description: productData.description,
      brand: { '@type': 'Brand', name: 'Main é Merveille' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        availability: productData.state === 'Prêtes à l\'emploi' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder'
      }
    };
    schemaScript.textContent = JSON.stringify(schema, null, 2);
  }
};

const contactFormEnhancements = () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const timestampField = form.querySelector('input[name="submittedAt"]');
  const statusField = form.querySelector('.status-message');

  const updateTimestamp = () => {
    if (timestampField) {
      timestampField.value = Math.floor(Date.now() / 1000);
    }
  };

  updateTimestamp();
  form.addEventListener('submit', updateTimestamp);

  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  if (status && statusField) {
    let message = '';
    let statusType = '';
    switch (status) {
      case 'success':
        message = 'Merci ! Votre demande a bien été envoyée. Je vous répondrai sous 48 heures.';
        statusType = 'success';
        break;
      case 'spam':
        message = 'Une erreur est survenue. Merci de réessayer ou de me contacter par téléphone.';
        statusType = 'error';
        break;
      default:
        message = 'Impossible d\'envoyer votre message. Merci de vérifier les champs obligatoires ou de me contacter directement.';
        statusType = 'error';
        break;
    }
    statusField.textContent = message;
    statusField.dataset.status = statusType;
    statusField.setAttribute('tabindex', '-1');
    statusField.focus();
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  }

  const fields = Array.from(form.querySelectorAll('[data-validate]'));
  if (!fields.length) return;

  const getErrorMessage = (field) => {
    if (field.validity.valueMissing) {
      if (field.type === 'checkbox') {
        return 'Merci de confirmer votre consentement pour être recontacté(e).';
      }
      switch (field.name) {
        case 'name':
          return 'Merci d\'indiquer votre nom pour faciliter nos échanges.';
        case 'email':
          return 'Merci de renseigner votre adresse e-mail.';
        case 'phone':
          return 'Merci de préciser un numéro de téléphone joignable.';
        default:
          return 'Merci de compléter ce champ.';
      }
    }
    if (field.validity.typeMismatch) {
      if (field.type === 'email') {
        return 'Le format de l\'adresse e-mail semble incorrect.';
      }
      return 'Le format saisi est invalide.';
    }
    if (field.validity.patternMismatch) {
      return 'Merci d\'indiquer un numéro de téléphone valide (6 caractères minimum).';
    }
    if (field.validity.tooShort) {
      return 'Merci de compléter ce champ avec davantage de détails.';
    }
    return 'Merci de vérifier les informations fournies.';
  };

  const setFieldValidity = (field, message) => {
    const container = field.closest('[data-field]');
    const messageEl = container?.querySelector('[data-error-message]');
    if (!container || !messageEl) return;
    if (message) {
      container.dataset.invalid = 'true';
      messageEl.textContent = message;
      messageEl.hidden = false;
      field.setAttribute('aria-invalid', 'true');
    } else {
      delete container.dataset.invalid;
      messageEl.textContent = '';
      messageEl.hidden = true;
      field.removeAttribute('aria-invalid');
    }
  };

  const validateField = (field) => {
    const isValid = field.checkValidity();
    const message = isValid ? '' : getErrorMessage(field);
    setFieldValidity(field, message);
    return isValid;
  };

  fields.forEach((field) => {
    const eventName = field.type === 'checkbox' ? 'change' : 'input';
    field.addEventListener(eventName, () => {
      if (field.dataset.touched === 'true') {
        validateField(field);
      }
    });
    field.addEventListener('blur', () => {
      field.dataset.touched = 'true';
      validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    let firstInvalid = null;
    fields.forEach((field) => {
      field.dataset.touched = 'true';
      const isValid = validateField(field);
      if (!isValid && !firstInvalid) {
        firstInvalid = field;
      }
    });
    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
    }
  });

  form.addEventListener('reset', () => {
    fields.forEach((field) => {
      delete field.dataset.touched;
      setFieldValidity(field, '');
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  siteNav();
  beforeAfterSliders();
  lightboxGallery();
  productFilters();
  productStorage();
  productDetail();
  contactFormEnhancements();
});
