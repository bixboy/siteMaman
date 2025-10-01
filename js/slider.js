(function () {
  const ACTIVE_DRAG_CLASS = 'is-dragging';

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setSliderPosition(slider, value) {
    const sliderBefore = slider.querySelector('.slider__before');
    const sliderSeparator = slider.querySelector('.slider__separator');
    const percentage = clamp(Number(value), 0, 100);

    if (sliderBefore) {
      sliderBefore.style.width = `${percentage}%`;
    }

    if (sliderSeparator) {
      sliderSeparator.style.left = `${percentage}%`;
    }
  }

  function handleRangeInput(event) {
    const slider = event.currentTarget.closest('.slider');
    if (!slider) {
      return;
    }

    setSliderPosition(slider, event.currentTarget.value);
  }

  function initDragBehaviour(slider) {
    const sliderRange = slider.querySelector('.slider__range');
    const sliderSeparator = slider.querySelector('.slider__separator');

    if (!sliderSeparator) {
      return;
    }

    let isDragging = false;

    const stopDragging = () => {
      isDragging = false;
      slider.classList.remove(ACTIVE_DRAG_CLASS);
    };

    const onPointerMove = (clientX) => {
      if (!isDragging) {
        return;
      }

      const rect = slider.getBoundingClientRect();
      const position = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);

      if (sliderRange) {
        sliderRange.value = position;
      }

      setSliderPosition(slider, position);
    };

    sliderSeparator.addEventListener('mousedown', () => {
      isDragging = true;
      slider.classList.add(ACTIVE_DRAG_CLASS);
    });

    sliderSeparator.addEventListener('touchstart', () => {
      isDragging = true;
      slider.classList.add(ACTIVE_DRAG_CLASS);
    });

    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);

    window.addEventListener('mousemove', (event) => onPointerMove(event.clientX));
    window.addEventListener('touchmove', (event) => {
      if (event.touches && event.touches[0]) {
        onPointerMove(event.touches[0].clientX);
      }
    });

    if (sliderRange) {
      sliderRange.addEventListener('input', handleRangeInput);
    }
  }

  function initializeSlider(slider) {
    const sliderRange = slider.querySelector('.slider__range');

    if (sliderRange) {
      setSliderPosition(slider, sliderRange.value || 50);
      sliderRange.addEventListener('input', handleRangeInput);
    } else {
      setSliderPosition(slider, 50);
    }

    initDragBehaviour(slider);
  }

  function initDragSliders(root = document) {
    const sliders = root.querySelectorAll('.slider');

    sliders.forEach((slider) => {
      if (!slider.dataset.initialized) {
        initializeSlider(slider);
        slider.dataset.initialized = 'true';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDragSliders();
  });

  window.initDragSliders = initDragSliders;
})();
