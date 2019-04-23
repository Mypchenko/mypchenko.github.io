document.body.onload = () => {
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

  // --- section nav ---
  const sectionNavContainer = document.getElementsByClassName(
    `sectionNavContainer`
  )[0];
  const sectionNavLinePointContainer = createElementWithClasses(
    `div`,
    `sectionNavLinePointContainer`
  );

  const sectionNavLinePoint = createElementWithClasses(
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

    const sectionName = createElementWithClasses(`div`, `sectionName`);

    const numberSpan = createElementWithClasses(`span`, `sectionName__number`);
    numberSpan.textContent = adjustNumLength(i + 1, 2);

    const nameSpan = createElementWithClasses(`span`, `sectionName__name`);
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
  page.addEventListener(`wheel`, wheelEventFunc);

  // --- start section ---
  const pageSection = {
    previous: sections.length - 1,
    current: sections.length - 1,
  };
  let busy = false;
  scrollToPage(0);

  // --- functions ---

  function scrollToPage(id) {
    if (!busy) {
      busy = true;

      const animationIsUpwards =
        pageSection.current - id === 1 ||
        (id === sections.length - 1 && pageSection.current === 0);

      deactivatePage(pageSection.current, animationIsUpwards);
      activatePage(id, animationIsUpwards);

      pageSection.previous = pageSection.current;
      pageSection.current = id;

      setTimeout(() => {
        busy = false;
      }, 500);
    }
    busy = true;
  }

  function activatePage(id, animationIsUpwards) {
    const page = sections[id];
    const mainMenuEntry = mainMenuElements[id];
    // TODO simplify
    const sectionNavLPContainer = Array.from(
      sectionNavContainer.children
    ).filter((val) => {
      return val.classList.contains(`sectionNavLinePointContainer_active`);
    })[id];

    sectionNavLPContainer.firstChild.classList.add(
      `sectionNavLinePoint_selected`
    );
    sectionNavLPContainer.lastChild.classList.add(`sectionName_nameShown`);

    mainMenuEntry.classList.add(`mainMenuElement_current`);
  }

  function deactivatePage(id, animationIsUpwards) {
    const page = sections[id];
    const mainMenuEntry = mainMenuElements[id];
    const sectionNavLPContainer = Array.from(
      sectionNavContainer.children
    ).filter((val) => {
      return val.classList.contains(`sectionNavLinePointContainer_active`);
    })[id];

    sectionNavLPContainer.firstChild.classList.remove(
      `sectionNavLinePoint_selected`
    );
    sectionNavLPContainer.lastChild.classList.remove(`sectionName_nameShown`);

    mainMenuEntry.classList.remove(`mainMenuElement_current`);
  }

  // TODO REMAINDER OPERATOR AND PURE FUNCTION
  function formatIdx(idx, arrLength) {
    if (idx < 0) return arrLength - 1;
    return idx % arrLength;
  }

  function createElementWithClasses(element, ...classes) {
    const local = document.createElement(element);

    if (classes.length > 0) {
      for (let i = 0; i < classes.length; ++i) {
        local.classList.add(classes[i]);
      }
    }

    return local;
  }

  function adjustNumLength(num, length) {
    let str = String(num);

    if (str.length < length) {
      while (str.length < length) {
        str = `0` + str;
      }
    } else {
      str = str.slice(str.length - length);
    }

    return str;
  }

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

  function wheelEventFunc(event) {
    if (event.target.classList.contains(`pageReturnArea`)) return;

    if (event.deltaY < 0) {
      const pageId = formatIdx(pageSection.current - 1, sections.length);
      scrollToPage(pageId);
    } else if (event.deltaY > 0) {
      const pageId = formatIdx(pageSection.current + 1, sections.length);
      scrollToPage(pageId);
    }

    event.preventDefault;
  }
};
