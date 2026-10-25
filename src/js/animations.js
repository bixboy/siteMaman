// --- Apparition au défilement des éléments [data-reveal] (classes .reveal / .is-visible dans base.css).
// Les classes sont posées par le JS : sans JS, tout reste visible.
export function initAnimations() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Une seule fois
      }
    });
  }, { rootMargin: '0px 0px -60px 0px' });

  elements.forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}
