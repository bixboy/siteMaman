document.addEventListener('DOMContentLoaded', function () {
  initSlider();
  initNavbar();
  initMobileMenu();

  initProductFilters();
  initProductClick();
  initProductPage();
  initModalLogic();
  initAnimations(); // Trigger Scroll Animations
});

// --- Product Click Handling (Market Page) ---
function initProductClick() {
  const detailButtons = document.querySelectorAll('.view-details');
  if (detailButtons.length === 0) return;

  detailButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productItem = this.closest('.product-item');
      if (!productItem) return;

      const productId = productItem.getAttribute('data-id');
      const productName = productItem.getAttribute('data-name');
      const productState = productItem.getAttribute('data-state');
      const productDescription = productItem.getAttribute('data-description');

      let productImages = [];
      try {
        productImages = JSON.parse(productItem.getAttribute('data-images'));
      } catch (err) {
        console.error("Error parsing images JSON", err);
      }

      localStorage.setItem('product', JSON.stringify({
        id: productId,
        name: productName,
        state: productState,
        description: productDescription,
        images: productImages
      }));

      window.location.href = 'product.html';
    });
  });
}

// --- Product Page Logic (Product Page) ---
function initProductPage() {
  const productNameEl = document.getElementById('product-name');
  if (!productNameEl) return; // Not on product page

  const productData = JSON.parse(localStorage.getItem('product'));
  if (!productData) return;

  productNameEl.textContent = productData.name;

  const stateEl = document.getElementById('product-state');
  if (stateEl) {
    // Safe check for newlines
    stateEl.innerHTML = (productData.state || '').replaceAll('\\n', '<br>');
  }

  const descEl = document.getElementById('product-description');
  if (descEl) {
    descEl.innerHTML = (productData.description || '').replaceAll('\\n', '<br>');
  }

  const slider = document.querySelector('.sliderProduct');
  if (slider && productData.images) {
    // Clear existing content if any (though usually empty)
    slider.innerHTML = '';

    productData.images.forEach((image, index) => {
      const imgElement = document.createElement('img');
      imgElement.classList.add('ImgSlider');
      // Adding a class for the modal trigger instead of duplicate IDs
      imgElement.classList.add('product-modal-trigger');
      imgElement.src = image;
      imgElement.alt = `${productData.name} - Image ${index + 1}`;
      slider.appendChild(imgElement);
    });

    // Initialize Slider Controls after images are added
    initProductGallery();
  }
}

function initProductGallery() {
  const images = document.querySelectorAll('.ImgSlider');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');

  if (images.length === 0) return;

  let currentIndex = 0;

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.remove('active');
      if (i === index) {
        img.classList.add('active');
      }
    });
  }

  if (prevButton && nextButton) {
    // Hide buttons if only 1 image
    if (images.length <= 1) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else {
      prevButton.style.display = 'flex';
      nextButton.style.display = 'flex';
    }

    nextButton.onclick = () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    };

    prevButton.onclick = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    };
  }

  // Show first image
  showImage(0);

  // Initialize Modal for these images
  initProductModal();
}

function initProductModal() {
  const modalImages = document.querySelectorAll('.product-modal-trigger');
  const modal = document.getElementById('myModalIMG');
  const modalImg = document.getElementById('image');
  // Note: product.html uses 'close' class for the X button
  const closeBtn = document.querySelector('#myModalIMG .close');

  if (!modal || modalImages.length === 0) return;

  modalImages.forEach(image => {
    image.addEventListener('click', function () {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      if (modalImg) modalImg.src = this.src;
    });
  });

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };
  }

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

// --- Slider Logic ---
function initSlider() {
  const sliders = document.querySelectorAll('.slider');
  if (sliders.length === 0) return;

  sliders.forEach(function (slider) {
    let sliderRange = slider.querySelector('.slider__range');
    let sliderBefore = slider.querySelector('.slider__before');
    let sliderSeparator = slider.querySelector('.slider__separator');

    if (!sliderRange || !sliderBefore || !sliderSeparator) return;

    function updateSliderPosition() {
      // Logic for Before/After slider
      sliderBefore.style.width = `${sliderRange.value}%`;
      sliderSeparator.style.left = `${sliderRange.value}%`;
    }

    sliderRange.addEventListener('input', updateSliderPosition);

    let isDragging = false;

    sliderSeparator.addEventListener('mousedown', function () {
      isDragging = true;
    });

    sliderSeparator.addEventListener('touchstart', function () {
      isDragging = true;
    });
    document.addEventListener('mouseup', function () {
      isDragging = false;
    });
    document.addEventListener('touchend', function () {
      isDragging = false;
    });

    document.addEventListener('mousemove', function (e) {
      processMove(e.clientX);
    });

    document.addEventListener('touchmove', function (e) {
      processMove(e.touches[0].clientX);
    });

    function processMove(x) {
      if (isDragging) {
        let sliderRect = slider.getBoundingClientRect();
        let newWidth = (x - sliderRect.left) / sliderRect.width * 100;
        sliderRange.value = newWidth;
        updateSliderPosition();
      }
    }
  });
}

// --- Navbar Scroll Effect ---
function initNavbar() {
  var navbar = document.querySelector('.box_navbar');
  if (!navbar) return;

  var scrollDistance = 25;

  function handleScroll() {
    if (window.pageYOffset > scrollDistance) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Initial check
  handleScroll();

  window.addEventListener('scroll', handleScroll);
}

// --- Mobile Menu ---
function initMobileMenu() {
  const menuToggle = document.getElementById('menu');
  const navLinks = document.querySelector(".nav-links");
  const background = document.querySelector(".background-menu");
  const body = document.body;

  if (!menuToggle || !navLinks) return;

  function closeMenu() {
    menuToggle.classList.remove('activeM');
    navLinks.classList.remove('mobile-menu');
    enableScroll();
  }

  function disableScroll() {
    document.body.classList.add('no-scroll');
    if (background) background.classList.add('active');
  }

  function enableScroll() {
    document.body.classList.remove('no-scroll');
    if (background) background.classList.remove('active');
  }

  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    menuToggle.classList.toggle('activeM');
    navLinks.classList.toggle('mobile-menu');

    if (navLinks.classList.contains('mobile-menu')) {
      disableScroll();
    } else {
      enableScroll();
    }
  });

  // Close menu when clicking outside
  body.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  // Provide a global close function if needed by other scripts
  window.closeMobileMenu = closeMenu;
}



// --- Utility Functions ---
window.scrollToCenter = function (sectionId) {
  // If sectionId is provided, find it; otherwise look for known defaults (legacy support)
  let section = null;
  if (sectionId) {
    section = document.getElementById(sectionId);
  } else {
    // Fallbacks for specific pages
    if (document.getElementById('prestations')) section = document.getElementById('prestations');
    else if (document.getElementById('listProduct')) section = document.getElementById('listProduct');
    else if (document.getElementById('containerSieges')) section = document.getElementById('containerSieges');
    else if (document.getElementById('form')) section = document.getElementById('form');
  }

  if (section) {
    if (window.closeMobileMenu) window.closeMobileMenu();
    section.scrollIntoView({ behavior: "smooth", block: 'center' });
  }
};

window.scrollTop = function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// --- Product Filters (Market Page) ---
function initProductFilters() {
  const filterButtons = document.querySelectorAll('.category-filter button');
  const products = document.querySelectorAll('.product-item');
  const loader = document.getElementById('loader');

  if (filterButtons.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      if (loader) loader.style.display = 'flex';

      setTimeout(() => {
        products.forEach(product => {
          if (filter === 'all') {
            product.style.display = 'flex';
          } else if (product.classList.contains(filter)) {
            product.style.display = 'flex';
          } else {
            product.style.display = 'none';
          }
        });
        if (loader) loader.style.display = 'none';
      }, 500);
    });
  });
}

// --- Modal Logic (Realisations Page) ---
function initModalLogic() {
  // Logic for "Before/After" Modals
  const modalTriggers = document.querySelectorAll('.modal-trigger1');
  const myModal = document.querySelector('#myModal');
  const container1 = document.querySelector('.slider__before');
  const container2 = document.querySelector('.slider__after');
  const sliderSeparator = document.querySelector('.slider__separator');

  if (modalTriggers.length > 0 && myModal) {
    modalTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        // Retrieve images from data attributes
        const beforeImg = this.getAttribute('data-before');
        const afterImg = this.getAttribute('data-after');

        // Reset positions
        if (sliderSeparator) sliderSeparator.style.left = '50%';
        if (container1) {
          container1.style.width = '50%';
          // Dynamically set background image
          if (beforeImg) {
            container1.style.backgroundImage = `url('${beforeImg}')`;
          }
        }
        if (container2) {
          // Dynamically set background image
          if (afterImg) {
            container2.style.backgroundImage = `url('${afterImg}')`;
          }
        }

        myModal.style.display = "block";
        document.body.style.overflow = "hidden";
      });
    });

    const closeBtn = myModal.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = function () {
        myModal.style.display = "none";
        document.body.style.overflow = "";
      };
    }

    window.addEventListener('click', function (event) {
      if (event.target == myModal) {
        myModal.style.display = 'none';
        document.body.style.overflow = "";
      }
    });
  }

  // Logic for Simple Image Modals (Realisations Page - second type)
  const simpleTriggers = document.querySelectorAll('.modal-trigger2');
  // reusing the same modal element if possible or different one
  const simpleModal = document.getElementById('myModalIMG');
  const simpleModalImg = document.getElementById("image");
  const closeBtn2 = simpleModal ? simpleModal.querySelector(".close2") : null;

  if (simpleTriggers.length > 0 && simpleModal) {
    simpleTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        simpleModal.style.display = "block";
        document.body.style.overflow = "hidden";

        const imageElement = this.querySelector('img');
        if (imageElement) {
          const imageUrl = imageElement.srcset || imageElement.src;
          if (simpleModalImg) simpleModalImg.src = imageUrl;
        }
      });
    });

    if (closeBtn2) {
      closeBtn2.onclick = function () {
        simpleModal.style.display = "none";
        document.body.style.overflow = "";
      };
    }

    window.addEventListener('click', function (event) {
      if (event.target == simpleModal) {
        simpleModal.style.display = 'none';
        document.body.style.overflow = "";
      }
    });
  }

  // --- Scroll Animations ---
  function initAnimations() {
    const observerOptions = {
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before element enters viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, observerOptions);

    // Target elements to animate
    const fadeUpElements = document.querySelectorAll('.product-item, .boxList div, .modal-trigger1, .modal-trigger2, .txt p');
    const fadeInElements = document.querySelectorAll('.titletTop, .category-filter, .presTop div h1');

    fadeUpElements.forEach(el => {
      el.classList.add('fade-up'); // Ensure class exists
      observer.observe(el);
    });

    fadeInElements.forEach(el => {
      el.classList.add('fade-in'); // Ensure class exists
      observer.observe(el);
    });
  }
}