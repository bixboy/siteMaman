import { setupModal } from './modal.js';

// --- Réalisations : ouvre le comparateur avant/après (#myModal) ---
export function initBeforeAfterModal() {
  const modalElement = document.getElementById('myModal');
  const triggers = document.querySelectorAll('.modal-trigger1');
  if (!modalElement || triggers.length === 0) return;

  const modal = setupModal(modalElement);
  const before = modalElement.querySelector('.slider__before');
  const after = modalElement.querySelector('.slider__after');
  const separator = modalElement.querySelector('.slider__separator');
  const range = modalElement.querySelector('.slider__range');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      before.style.backgroundImage = `url('${trigger.dataset.before}')`;
      after.style.backgroundImage = `url('${trigger.dataset.after}')`;
      before.style.width = '50%';
      separator.style.left = '50%';
      range.value = 50;
      modal.open();
    });
  });
}

// --- Photo agrandie (#myModalIMG) : réalisations simples (data-full) et photos produit ---
export function initPhotoModal() {
  const modalElement = document.getElementById('myModalIMG');
  const triggers = document.querySelectorAll('.modal-trigger2, .product-modal-trigger');
  if (!modalElement || triggers.length === 0) return;

  const modal = setupModal(modalElement);
  const image = modalElement.querySelector('#image');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      image.src = trigger.dataset.full || trigger.src;
      modal.open();
    });
  });
}
