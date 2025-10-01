(function () {
  const SCROLL_THRESHOLD = 25;
  let openModals = 0;

  function updateNavbarState() {
    const navbar = document.querySelector('.box_navbar');

    if (!navbar) {
      return;
    }

    if (window.pageYOffset > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function lockScroll() {
    document.body.classList.add('no-scroll');
  }

  function unlockScroll() {
    openModals = Math.max(openModals - 1, 0);

    if (openModals === 0) {
      document.body.classList.remove('no-scroll');
    }
  }

  function handleModalVisibility(modal, shouldOpen) {
    if (!modal) {
      return;
    }

    if (shouldOpen) {
      if (!modal.classList.contains('modal--visible')) {
        modal.classList.add('modal--visible');
        openModals += 1;
      }
      lockScroll();
    } else {
      if (modal.classList.contains('modal--visible')) {
        modal.classList.remove('modal--visible');
        unlockScroll();
      }
    }
  }

  function setupMobileMenu() {
    const menuToggle = document.getElementById('menu');
    const navLinks = document.querySelector('.nav-links');
    const background = document.querySelector('.background-menu');

    if (!menuToggle || !navLinks) {
      return;
    }

    const openMenu = () => {
      menuToggle.classList.add('activeM');
      navLinks.classList.add('mobile-menu');
      background?.classList.add('active');
      lockScroll();
    };

    const closeMenu = () => {
      menuToggle.classList.remove('activeM');
      navLinks.classList.remove('mobile-menu');
      background?.classList.remove('active');
      if (openModals === 0) {
        document.body.classList.remove('no-scroll');
      }
    };

    const toggleMenu = (event) => {
      event.stopPropagation();

      if (navLinks.classList.contains('mobile-menu')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    menuToggle.addEventListener('click', toggleMenu);

    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });

    return { closeMenu };
  }

  function setupSmoothScroll(closeMenu) {
    const triggers = document.querySelectorAll('[data-scroll-target]');

    if (!triggers.length) {
      return;
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const targetId = trigger.getAttribute('data-scroll-target');

        if (!targetId) {
          return;
        }

        const targetElement = document.getElementById(targetId);

        if (!targetElement) {
          return;
        }

        if (trigger.tagName.toLowerCase() === 'a') {
          event.preventDefault();
        }

        closeMenu?.();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: trigger.getAttribute('data-scroll-block') || 'center'
        });
      });
    });
  }

  function setupScrollTop(closeMenu) {
    const triggers = document.querySelectorAll('[data-scroll-top]');

    if (!triggers.length) {
      return;
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        closeMenu?.();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });

    const menu = setupMobileMenu();
    setupSmoothScroll(menu?.closeMenu);
    setupScrollTop(menu?.closeMenu);
  });

  window.Site = {
    openModal(modal) {
      handleModalVisibility(modal, true);
    },
    closeModal(modal) {
      handleModalVisibility(modal, false);
    }
  };
})();
