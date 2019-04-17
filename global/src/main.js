document.body.onload = () => {
  const pageSection = {
    previous: 0,
    current: 0,
  };

  const page = document.getElementsByClassName(`pageContainer`)[0];
  const mainMenuBtn = document.getElementsByClassName(`mainMenuBtn`)[0];
  const mainMenuElements = Array.from(
    document.getElementsByClassName(`mainMenuElement`)
  );
  const pageReturnArea = document.getElementsByClassName(`pageReturnArea`)[0];
  const sectionsContainer = document.getElementsByClassName(
    `sectionsContainer`
  )[0];
  const sections = sectionsContainer.children;

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
  const sectionNavContainer = document.getElementsByClassName(
    `sectionNavContainer`
  )[0];
  const sectionNavLinePointContainer = crtElementWithClasses(
    `div`,
    `sectionNavLinePointContainer`
  );

  const sectionNavLinePoint = crtElementWithClasses(
    `div`,
    `sectionNavLinePoint`
  );

  sectionNavLinePointContainer.appendChild(sectionNavLinePoint.cloneNode());

  for (let i = 0; i < sections.length; ++i) {
    const sectionNavLinePointContainerCopy = sectionNavLinePointContainer.cloneNode(
      { deep: true }
    );

    sectionNavLinePointContainerCopy.firstChild.classList.add(
      `sectionNavLinePoint_active`
    );
    sectionNavLinePointContainerCopy.classList.add(
      `sectionNavLinePointContainer_active`
    );

    const sectionName = crtElementWithClasses(`div`, `sectionName`);

    const numberSpan = crtElementWithClasses(`span`, `sectionName__number`);
    numberSpan.textContent = toTwoDigits(i + 1);

    const nameSpan = crtElementWithClasses(`span`, `sectionName__name`);
    nameSpan.textContent = sections[i].dataset.name;

    sectionName.appendChild(numberSpan);
    sectionName.appendChild(nameSpan);

    sectionNavLinePointContainerCopy.appendChild(sectionName);
    sectionNavContainer.appendChild(sectionNavLinePointContainerCopy);

    if (i < sections.length - 1) {
      for (let i = 0; i < 3; ++i) {
        sectionNavContainer.appendChild(
          sectionNavLinePointContainer.cloneNode({ deep: true })
        );
      }
    }
  }

  // TODO --- scrolling events ---
  sectionsContainer.addEventListener(`wheel`, (event) => {
    if (event.deltaY < 0) {
      scrollPageSections(`prev`);
    } else if (event.deltaY > 0) {
      scrollPageSections(`next`);
    }

    event.preventDefault;
  });

  // --- functions ---

  function crtElementWithClasses(element, ...classes) {
    const local = document.createElement(element);

    if (classes.length > 0) {
      for (let i = 0; i < classes.length; ++i) {
        local.classList.add(classes[i]);
      }
    }

    return local;
  }

  function toTwoDigits(num) {
    let str = String(num);

    while (str.length < 2) {
      str = `0` + str;
    }

    return str;
  }
};
