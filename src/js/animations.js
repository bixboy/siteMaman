// --- Apparition des éléments au scroll (classes .fade-up / .fade-in définies dans body.css) ---
export function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Une seule fois
      }
    });
  }, {
    threshold: 0.2, // Visible à 20 %
    rootMargin: '0px 0px -50px 0px',
  });

  const animate = (selector, className) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.add(className);
      observer.observe(element);
    });
  };

  animate('.product-item, .boxList div, .modal-trigger1, .modal-trigger2, .txt p', 'fade-up');
  animate('.titletTop, .category-filter, .presTop div h1', 'fade-in');
}
