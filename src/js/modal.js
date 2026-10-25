// Modale plein écran (.modal) : fermeture par la croix, un clic sur le fond ou la touche Échap
export function setupModal(modal) {
  const close = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  modal.querySelector('.close, .close2')?.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  return {
    open() {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    },
    close,
  };
}
