// --- Comparateur avant/après ([data-avant-apres]) : glisser à la souris ou au doigt, flèches au clavier ---

export function setPosition(comparator, value) {
  const position = Math.min(100, Math.max(0, value));
  comparator.style.setProperty('--pos', position);
  const range = comparator.querySelector('input[type="range"]');
  if (range) range.value = position;
}

export function initBeforeAfterSliders() {
  document.querySelectorAll('[data-avant-apres]').forEach((comparator) => {
    const range = comparator.querySelector('input[type="range"]');
    range?.addEventListener('input', () => setPosition(comparator, Number(range.value)));

    const followPointer = (event) => {
      const rect = comparator.getBoundingClientRect();
      setPosition(comparator, ((event.clientX - rect.left) / rect.width) * 100);
    };
    comparator.addEventListener('pointerdown', (event) => {
      event.preventDefault(); // sinon le navigateur retire le focus donné au curseur juste après
      comparator.setPointerCapture(event.pointerId);
      followPointer(event);
      range?.focus({ preventScroll: true });
    });
    comparator.addEventListener('pointermove', (event) => {
      if (comparator.hasPointerCapture(event.pointerId)) followPointer(event);
    });
  });
}
