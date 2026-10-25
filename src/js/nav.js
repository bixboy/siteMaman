// --- Navbar : fond au scroll, menu mobile, liens de défilement ---

let closeMobileMenu = () => {};

export function initNavbar() {
  const navbar = document.querySelector('.box_navbar');
  if (!navbar) return;

  const scrollDistance = 25;
  const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > scrollDistance);

  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

export function initMobileMenu() {
  const menuToggle = document.getElementById('menu');
  const navLinks = document.querySelector('.nav-links');
  const background = document.querySelector('.background-menu');
  if (!menuToggle || !navLinks) return;

  const setOpen = (open) => {
    menuToggle.classList.toggle('activeM', open);
    navLinks.classList.toggle('mobile-menu', open);
    document.body.classList.toggle('no-scroll', open);
    background?.classList.toggle('active', open);
  };
  closeMobileMenu = () => setOpen(false);

  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!navLinks.classList.contains('mobile-menu'));
  });

  // Fermer le menu en cliquant en dehors
  document.body.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMobileMenu();
  });
}

function scrollToCenter(section) {
  closeMobileMenu();
  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const samePage = (link) =>
  link.pathname.replace(/index\.html$/, '') === window.location.pathname.replace(/index\.html$/, '');

// data-scroll-to="id" : défile jusqu'à la section ; data-scroll-top : remonte en haut ;
// lien vers une ancre de la page courante (ex. /#prestations depuis l'accueil) : défilement doux centré
export function initScrollLinks() {
  document.addEventListener('click', (event) => {
    const scrollTo = event.target.closest('[data-scroll-to]');
    if (scrollTo) {
      const section = document.getElementById(scrollTo.dataset.scrollTo);
      if (section) scrollToCenter(section);
      return;
    }

    if (event.target.closest('[data-scroll-top]')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const link = event.target.closest('a[href*="#"]');
    if (link && link.hash && samePage(link)) {
      const section = document.getElementById(link.hash.slice(1));
      if (!section) return;
      event.preventDefault();
      scrollToCenter(section);
    }
  });
}
