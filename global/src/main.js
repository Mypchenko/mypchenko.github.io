document.body.onload = () => {
  const page = document.getElementsByClassName(`pageContainer`)[0];
  const mainMenuBtn = document.getElementsByClassName(`mainMenuBtn`)[0];
  const mainMenuElements = Array.from(
    document.getElementsByClassName(`mainMenuElement`)
  );
  const pageReturnArea = document.getElementsByClassName(`pageReturnArea`)[0];

  for (let i = 0; i < mainMenuElements.length; ++i) {
    mainMenuElements[i].style.transitionDelay = `${i * 0.05}s`;
  }

  pageReturnArea.addEventListener(`click`, mainMenuViewToggle);
  mainMenuBtn.addEventListener(`click`, mainMenuViewToggle);

  function mainMenuViewToggle(e) {
    page.classList.toggle(`pageContainer_zoomedOut`);
    pageReturnArea.classList.toggle(`inactive`);

    const transitionDelayCf = ~e.path.indexOf(mainMenuBtn) ? 0.05 : 0;
    for (let i = 0; i < mainMenuElements.length; ++i) {
      mainMenuElements[i].style.transitionDelay = `${i * transitionDelayCf}s`;
    }
    mainMenuElements.forEach((element) => {
      element.classList.toggle(`mainMenuElement_appear`);
    });

    e.stopPropagation;
  }
};
