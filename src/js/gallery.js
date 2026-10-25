import { setPosition } from './before-after.js';
import { setupModal } from './modal.js';

// --- Réalisations : ouvre le comparateur ([data-avant] + [data-apres] → #modale-avant-apres) ---
export function initBeforeAfterModal() {
  const element = document.getElementById('modale-avant-apres');
  const triggers = document.querySelectorAll('[data-avant][data-apres]');
  if (!element || triggers.length === 0) return;

  const modal = setupModal(element);
  const comparator = element.querySelector('[data-avant-apres]');
  const before = element.querySelector('[data-image-avant]');
  const after = element.querySelector('[data-image-apres]');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      before.src = trigger.dataset.avant;
      after.src = trigger.dataset.apres;
      setPosition(comparator, 50);
      modal.open();
    });
  });
}

// --- Photo agrandie : [data-photo] = URL de la photo pleine taille (réalisations, page produit) ---
export function initPhotoModal() {
  const element = document.getElementById('modale-photo');
  const triggers = document.querySelectorAll('[data-photo]');
  if (!element || triggers.length === 0) return;

  const modal = setupModal(element);
  const image = element.querySelector('[data-modale-image]');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      image.src = trigger.dataset.photo;
      image.alt = trigger.querySelector('img')?.alt ?? '';
      modal.open();
    });
  });
}
