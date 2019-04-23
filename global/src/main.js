document.body.onload = () => {
  const page = document.getElementsByClassName(`pageContainer`)[0];
  const pageReturnArea = document.getElementsByClassName(`pageReturnArea`)[0];
  const mainMenuContainer = document.getElementsByClassName(`mainMenu`)[0];
  const mainMenuBtn = document.getElementsByClassName(`mainMenuBtn`)[0];
  const sectionNavContainer = document.getElementsByClassName(
    `sectionNavContainer`
  )[0];
  const sectionsContainer = document.getElementsByClassName(
    `sectionsContainer`
  )[0];
  const sections = sectionsContainer.children;

  // --- main menu ---

  createMainMenuEntries(
    sections,
    mainMenuContainer,
    mainMenuBtn,
    pageReturnArea
  );
  const mainMenuElements = Array.from(
    document.getElementsByClassName(`mainMenuElement`)
  );

  // --- section nav ---

  createSectionPoints(sections, sectionNavContainer);

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
    const sectionNavLPContainer = document.getElementsByClassName(
      `sectionNavLinePointContainer_active`
    )[id];

    sectionNavLPContainer.firstChild.classList.add(
      `sectionNavLinePoint_selected`
    );
    sectionNavLPContainer.lastChild.classList.add(`sectionName_nameShown`);

    mainMenuEntry.classList.add(`mainMenuElement_current`);
  }

  function deactivatePage(id, animationIsUpwards) {
    const page = sections[id];
    const mainMenuEntry = mainMenuElements[id];
    const sectionNavLPContainer = document.getElementsByClassName(
      `sectionNavLinePointContainer_active`
    )[id];

    sectionNavLPContainer.firstChild.classList.remove(
      `sectionNavLinePoint_selected`
    );
    sectionNavLPContainer.lastChild.classList.remove(`sectionName_nameShown`);

    mainMenuEntry.classList.remove(`mainMenuElement_current`);
  }

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

  function createMainMenuEntries(entriesSource, container, ...menuButtons) {
    const list = document.createElement(`ul`);
    for (const entry of entriesSource) {
      const menuElement = createElementWithClasses(`li`, `mainMenuElement`);
      menuElement.textContent = entry.dataset.name;
      list.appendChild(menuElement);
    }
    container.appendChild(list);

    for (const button of menuButtons) {
      button.addEventListener(`click`, mainMenuViewToggle);
    }
  }

  function createSectionPoints(entriesSource, container) {
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
      const containerCopy = sectionNavLinePointContainer.cloneNode({
        deep: true,
      });

      containerCopy.firstChild.classList.add(`sectionNavLinePoint_active`);
      containerCopy.classList.add(`sectionNavLinePointContainer_active`);

      const sectionName = createElementWithClasses(`div`, `sectionName`);

      const numberSpan = createElementWithClasses(
        `span`,
        `sectionName__number`
      );
      numberSpan.textContent = adjustNumLength(i + 1, 2);
      numberSpan.dataset.idx = i;
      numberSpan.addEventListener(`click`, sectionPointClickEvent);

      const nameSpan = createElementWithClasses(`span`, `sectionName__name`);
      nameSpan.textContent = sections[i].dataset.name;

      sectionName.appendChild(numberSpan);
      sectionName.appendChild(nameSpan);

      containerCopy.appendChild(sectionName);
      container.appendChild(containerCopy);

      if (i < sections.length - 1) {
        for (let i = 0; i < 3; ++i) {
          container.appendChild(
            sectionNavLinePointContainer.cloneNode({ deep: true })
          );
        }
      }
    }
  }

  function sectionPointClickEvent(event) {
    const id = Number(event.target.dataset.idx);

    if (page.current === id) return;

    scrollToPage(id);
  }
};
