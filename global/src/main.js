document.body.onload = () => {
  const page = document.getElementsByClassName(`pageContainer`)[0];
  const mainMenuBtn = document.getElementsByClassName(`mainMenuBtn`)[0];
  const mainMenuElements = Array.from(
    document.getElementsByClassName(`mainMenuElement`)
  );
  const pageReturnArea = document.getElementsByClassName(`pageReturnArea`)[0];
  const sections = document.getElementsByClassName(`sectionsContainer`)[0]
    .children;

  // --- main menu ---
  for (let i = 0; i < mainMenuElements.length; ++i) {
    mainMenuElements[i].style.transitionDelay = `${i * 0.05}s`;
  }

  pageReturnArea.addEventListener(`click`, mainMenuViewToggle);
  mainMenuBtn.addEventListener(`click`, mainMenuViewToggle);

  function mainMenuViewToggle(e) {
    const isOpeningAnimation = page.classList.toggle(`pageContainer_zoomedOut`);
    pageReturnArea.classList.toggle(`inactive`);

    const transitionDelayCf = isOpeningAnimation ? 0.05 : 0.02;

    for (let i = 0; i < mainMenuElements.length; ++i) {
      mainMenuElements[i].style.transitionDelay = `${(isOpeningAnimation
        ? i
        : mainMenuElements.length - i - 1) * transitionDelayCf}s`;
    }

    mainMenuElements.map((element) => {
      element.classList.toggle(`mainMenuElement_appear`);
    });

    e.stopPropagation;
  }

  // --- section nav ---
  //    --- section line points ---

  const linePointsContainer = document.getElementsByClassName(
    `sectionNavLinePointsContainer`
  )[0];
  const linePoint = document.createElement(`DIV`);
  linePoint.classList.add(`sectionNavLinePoint`);
  const linePointActive = document.createElement(`DIV`);
  linePointActive.classList.add(
    `sectionNavLinePoint`,
    `sectionNavLinePoint_active`
  );

  for (let i = 0; i < sections.length; ++i) {
    linePointsContainer.appendChild(linePointActive.cloneNode());
    if (i < sections.length - 1) {
      for (let i = 0; i < 3; ++i) {
        linePointsContainer.appendChild(linePoint.cloneNode());
      }
    }
  }
};
