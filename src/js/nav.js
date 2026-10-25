// --- En-tête : ombre au défilement, menu mobile (panneau latéral), retour en haut ---

let closeMenu = () => {};

export function initHeader() {
  const header = document.querySelector('[data-entete]');
  const backToTop = document.querySelector('[data-scroll-top]');

  const update = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 10);
    backToTop?.classList.toggle('is-visible', window.scrollY > 600);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0 }));
}

export function initMobileMenu() {
  const button = document.querySelector('[data-menu-bouton]');
  const menu = document.querySelector('[data-menu]');
  const veil = document.querySelector('[data-menu-voile]');
  if (!button || !menu) return;

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    veil?.classList.toggle('is-visible', open);
    document.body.classList.toggle('no-scroll', open);
  };
  closeMenu = () => setOpen(false);

  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  veil?.addEventListener('click', closeMenu);
  // Un lien du menu (ex. /#prestations sur l'accueil) ferme le panneau avant de défiler
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  // Passage en affichage ordinateur : le panneau ne doit pas rester ouvert
  window.matchMedia('(min-width: 992px)').addEventListener('change', closeMenu);
}
