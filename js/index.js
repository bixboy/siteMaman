(function () {
  function duplicateSuppliers() {
    const container = document.querySelector('.containerFourni');
    const list = document.querySelector('.listFourni');

    if (!container || !list) {
      return;
    }

    const alreadyCloned = container.querySelector('.listFourni[data-clone="true"]');

    if (alreadyCloned) {
      return;
    }

    const clone = list.cloneNode(true);
    clone.setAttribute('data-clone', 'true');
    container.appendChild(clone);
  }

  document.addEventListener('DOMContentLoaded', () => {
    duplicateSuppliers();
  });
})();
