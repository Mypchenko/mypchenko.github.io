document.body.onload = () => {
  // --- page elements ---

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
  const sections = Array.from(sectionsContainer.children).filter(
    (val) => val.nodeName === `SECTION`
  );
  const pageControls = document.getElementsByClassName(`pageControls`)[0];

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

  // --- page controls ---

  pageControls.addEventListener(`click`, pageControlFunc);

  // TODO --- scrolling events ---

  page.addEventListener(`wheel`, wheelEventFunc);

  page.addEventListener(`touchstart`, (outerEvent) => {
    if (outerEvent.touches.length == 1) {
      page.addEventListener(`touchend`, touchendEvent);
    }

    function touchendEvent(innerEvent) {
      page.removeEventListener(`touchend`, touchendEvent);

      const xChange =
        innerEvent.changedTouches[0].clientX -
        outerEvent.changedTouches[0].clientX;
      const yChange =
        (innerEvent.changedTouches[0].clientY -
          outerEvent.changedTouches[0].clientY) *
        -1;

      swipeAction(
        innerEvent.timeStamp - outerEvent.timeStamp,
        xChange,
        yChange,
        outerEvent.target
      );
    }
  });

  // --- start section ---
  const pageSection = {
    previous: 0,
    current: 0,
  };
  let busy = false;
  activatePage(0);

  // --- functions ---

  function pageControlFunc(event) {
    if (scrollIsUp(event.target)) {
      const pageId = formatIdx(pageSection.current - 1, sections.length);
      scrollToPage(pageId);
    } else {
      const pageId = formatIdx(pageSection.current + 1, sections.length);
      scrollToPage(pageId);
    }

    event.stopPropagation;

    function scrollIsUp(target) {
      if (target.nodeName === `IMG`) {
        return target.classList.contains(`pageControlBtn__img_up`);
      } else {
        return target.firstChild.classList.contains(`pageControlBtn__img_up`);
      }
    }
  }

  function swipeAction(time, xChange, yChange, target) {
    const length = Math.sqrt(xChange ** 2 + yChange ** 2);
    const angle = calcPathAngle(xChange, yChange);

    if (target.classList.contains(`pageReturnArea`)) return;

    if (time > 50 && length > 10 && angle !== null) {
      if (angle >= Math.PI / 4 && angle <= 3 * Math.PI / 4) {
        const pageId = formatIdx(pageSection.current - 1, sections.length);
        scrollToPage(pageId);
      } else if (angle >= 5 * Math.PI / 4 && angle <= 7 * Math.PI / 4) {
        const pageId = formatIdx(pageSection.current + 1, sections.length);
        scrollToPage(pageId);
      }
    }
  }

  function calcPathAngle(x, y) {
    const tmp = Math.atan2(y, x);

    if (x === 0 && y === 0) return null;
    if (tmp < 0) return Math.PI + (Math.PI - tmp * -1);

    return tmp;
  }

  function scrollToPage(id) {
    if (!busy) {
      if (page.current === id) return;

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
      }, 400);
    }
    busy = true;
  }

  function activatePage(id, animationIsUpwards) {
    toggleNavigationEntries(id);

    const page = sections[id];
    const animationClass = !animationIsUpwards
      ? `pageSection_above`
      : `pageSection_below`;

    page.classList.add(animationClass);
    page.classList.add(`pageSection_active`);
    setTimeout(() => {
      page.classList.remove(animationClass);
    }, 50);
  }

  function deactivatePage(id, animationIsUpwards) {
    toggleNavigationEntries(id);

    const page = sections[id];
    const animationClass = animationIsUpwards
      ? `pageSection_above`
      : `pageSection_below`;

    page.classList.add(animationClass);
    page.classList.remove(`pageSection_active`);
    setTimeout(() => {
      page.classList.remove(animationClass);
    }, 400);
  }

  function toggleNavigationEntries(id) {
    const mainMenuEntry = mainMenuElements[id];
    const sectionNavLPContainer = document.getElementsByClassName(
      `sectionNavLinePointContainer_active`
    )[id];
    sectionNavLPContainer.firstChild.classList.toggle(
      `sectionNavLinePoint_selected`
    );
    sectionNavLPContainer.lastChild.classList.toggle(`sectionName_nameShown`);
    mainMenuEntry.classList.toggle(`mainMenuElement_current`);
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

  function mainMenuViewToggle(event) {
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

    if (event) event.stopPropagation;
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
    for (let i = 0; i < entriesSource.length; ++i) {
      const entry = entriesSource[i];
      const menuElement = createElementWithClasses(`li`, `mainMenuElement`);
      menuElement.textContent = entry.dataset.name;
      menuElement.dataset.idx = i;
      menuElement.addEventListener(`click`, mainMenuClickFunc);
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

    if (
      event.target.parentElement.classList.contains(`sectionName_nameShown`)
    ) {
      return;
    }

    scrollToPage(id);
  }

  function mainMenuClickFunc(event) {
    const id = Number(event.target.dataset.idx);

    if (event.target.classList.contains(`mainMenuElement_current`)) return;

    mainMenuViewToggle();
    setTimeout(() => {
      scrollToPage(id);
    }, 200);
  }
};
