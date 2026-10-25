// --- Curseur de comparaison avant/après (.slider avec .slider__range) ---
export function initBeforeAfterSliders() {
  document.querySelectorAll('.slider').forEach((slider) => {
    const range = slider.querySelector('.slider__range');
    const before = slider.querySelector('.slider__before');
    const separator = slider.querySelector('.slider__separator');
    if (!range || !before || !separator) return;

    const update = () => {
      before.style.width = `${range.value}%`;
      separator.style.left = `${range.value}%`;
    };
    range.addEventListener('input', update);

    let isDragging = false;
    const startDrag = () => { isDragging = true; };
    const stopDrag = () => { isDragging = false; };
    const move = (x) => {
      if (!isDragging) return;
      const rect = slider.getBoundingClientRect();
      range.value = ((x - rect.left) / rect.width) * 100;
      update();
    };

    separator.addEventListener('mousedown', startDrag);
    separator.addEventListener('touchstart', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('mousemove', (event) => move(event.clientX));
    document.addEventListener('touchmove', (event) => move(event.touches[0].clientX));
  });
}
