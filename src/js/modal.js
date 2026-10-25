import { trapFocus } from './focus.js';

// Modale plein écran (.modale, masquée par [hidden]) : fermeture par la croix, un clic sur le fond
// ou la touche Échap ; le focus reste dans la modale puis revient sur l'élément qui l'a ouverte.
export function setupModal(modal) {
  const closeButton = modal.querySelector('[data-modale-fermer]');
  let opener = null;

  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    opener?.focus();
  };

  closeButton?.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') close();
    else trapFocus(modal, event);
  });

  return {
    open() {
      opener = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('no-scroll');
      closeButton?.focus();
    },
    close,
  };
}
