// Point d'entrée (module ES, exécuté une fois le HTML chargé).
// Chaque init ne fait rien si ses éléments sont absents de la page.
import { initAnimations } from './animations.js';
import { initBeforeAfterSliders } from './before-after.js';
import { initBeforeAfterModal, initPhotoModal } from './gallery.js';
import { initMobileMenu, initNavbar, initScrollLinks } from './nav.js';
import { initProductFilters, initProductGallery } from './products.js';

initNavbar();
initMobileMenu();
initScrollLinks();
initBeforeAfterSliders();
initBeforeAfterModal();
initPhotoModal();
initProductFilters();
initProductGallery();
initAnimations();
