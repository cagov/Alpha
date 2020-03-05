document.querySelectorAll('.show-all').forEach(x => {
  const isCloseButton = x.classList.contains('d-none');

  x.addEventListener('click', () => {
    let wait = 0;
    document
      .querySelectorAll(
        `.list-group-item-action${
          isCloseButton ? '.list-open' : ':not(.list-open)'
        }`
      )
      .forEach(x => setTimeout(() => x.click(), 50 * wait++));

    document
      .querySelectorAll('.show-all')
      .forEach(y => y.classList.toggle('d-none'));
  });
});
