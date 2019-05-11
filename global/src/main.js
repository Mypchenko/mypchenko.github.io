const globalObj = Object.create(null);
globalObj.transition = 400;

document.body.onload = () => {
  mainGlobalFunc();
};

// --- functions ---
function mainGlobalFunc() {
  // --- page elements ---

  globalObj.page = document.getElementsByClassName(`pageContainer`)[0];
  globalObj.pageReturnArea = document.getElementsByClassName(
    `pageReturnArea`
  )[0];
  const mainMenuContainer = document.getElementsByClassName(`mainMenu`)[0];
  const mainMenuBtn = document.getElementsByClassName(`mainMenuBtn`)[0];
  const sectionNavContainer = document.getElementsByClassName(
    `sectionNavContainer`
  )[0];
  const sectionsContainer = document.getElementsByClassName(
    `sectionsContainer`
  )[0];
  globalObj.sections = Array.from(sectionsContainer.children).filter(
    (val) => val.nodeName === `SECTION`
  );
  const pageControls = document.getElementsByClassName(`pageControls`)[0];

  // --- main menu ---

  createMainMenuEntries(
    globalObj.sections,
    mainMenuContainer,
    mainMenuBtn,
    globalObj.pageReturnArea
  );
  globalObj.mainMenuElements = Array.from(
    document.getElementsByClassName(`mainMenuElement`)
  );

  // --- section nav ---

  createSectionPoints(globalObj.sections, sectionNavContainer);

  // --- page controls ---

  pageControls.addEventListener(`click`, pageControlFunc);

  // --- scrolling events ---

  document.addEventListener(`wheel`, wheelEventFunc);
  console.log(globalObj);

  globalObj.page.addEventListener(`touchstart`, (outerEvent) => {
    if (outerEvent.touches.length == 1) {
      globalObj.page.addEventListener(`touchend`, touchendEvent);
    }

    function touchendEvent(innerEvent) {
      globalObj.page.removeEventListener(`touchend`, touchendEvent);

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
  globalObj.pageSection = {
    previous: 0,
    current: 0,
  };
  globalObj.busy = false;
  activatePage(0);
  // --- slider init ---
  sliderInit();
}

function sliderInit() {
  globalObj.sliderBusy = false;
  globalObj.sliderClasses = [
    `sliderItem_left`,
    `sliderItem_center`,
    `sliderItem_right`,
  ];
  globalObj.sliderContainer = document.getElementsByClassName(
    `sliderContent`
  )[0];
  globalObj.sliderEntries = Array.from(globalObj.sliderContainer.children);
  globalObj.sliderLength = globalObj.sliderEntries.length;
  globalObj.sliderCurIdx = 1;

  for (let i = 3, n = globalObj.sliderEntries.length; i < n; ++i) {
    globalObj.sliderEntries[i].remove();
  }

  nodesAddClasses(globalObj.sliderContainer.children, globalObj.sliderClasses);
}

function sliderAction(str) {
  if (!globalObj.sliderBusy) {
    let directionIsLeft = true;

    if (str[0].toLowerCase() === `r`) {
      directionIsLeft = false;
    } else if (str[0].toLowerCase() !== `l`) {
      throw new Error(`Wrong slider action direction`);
    }

    nodesRemoveClasses(
      globalObj.sliderContainer.children,
      globalObj.sliderClasses
    );

    const addIdx = formatIdx(
      globalObj.sliderCurIdx + 2 * (directionIsLeft ? -1 : 1),
      globalObj.sliderLength
    );
    const insertNode = directionIsLeft
      ? globalObj.sliderContainer.children[0]
      : null;

    globalObj.sliderContainer.insertBefore(
      globalObj.sliderEntries[addIdx],
      insertNode
    );

    nodesAddClasses(
      Array.from(globalObj.sliderContainer.children).slice(1, 3),
      globalObj.sliderClasses.slice(directionIsLeft ? 1 : 0, 3)
    );

    console.log(`--------`);

    console.log(directionIsLeft);

    if (directionIsLeft) {
      globalObj.sliderContainer.children[0].classList.add(
        [`sliderItem_offscreenLeft`, `sliderItem_offscreenRight`][0]
      );
      globalObj.sliderContainer.children[3].classList.add(`sliderItem_right`);
    } else {
      globalObj.sliderContainer.children[3].classList.add(
        [`sliderItem_offscreenLeft`, `sliderItem_offscreenRight`][1]
      );
      globalObj.sliderContainer.children[0].classList.add(
        [`sliderItem_offscreenLeft`, `sliderItem_offscreenRight`][0]
      );
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (directionIsLeft) {
          globalObj.sliderContainer.children[3].classList.add(
            [`sliderItem_offscreenLeft`, `sliderItem_offscreenRight`][1]
          );
          globalObj.sliderContainer.children[3].classList.remove(
            `sliderItem_right`
          );
          nodesAddClasses(
            Array.from(globalObj.sliderContainer.children).slice(0, 1),
            globalObj.sliderClasses.slice(0, 1)
          );
        } else {
          nodesAddClasses(
            Array.from(globalObj.sliderContainer.children).slice(3),
            globalObj.sliderClasses.slice(2)
          );
        }

        setTimeout(() => {
          globalObj.sliderContainer.children[
            directionIsLeft ? 3 : 0
          ].classList.remove(
            [`sliderItem_offscreenLeft`, `sliderItem_offscreenRight`][
              directionIsLeft ? 1 : 0
            ]
          );
          globalObj.sliderContainer.children[
            directionIsLeft ? 0 : 3
          ].classList.remove(
            [`sliderItem_offscreenLeft`, `sliderItem_offscreenRight`][
              directionIsLeft ? 0 : 1
            ]
          );

          const removeIdx = directionIsLeft
            ? globalObj.sliderContainer.children.length - 1
            : 0;
          globalObj.sliderContainer.children[removeIdx].remove();

          globalObj.sliderCurIdx = formatIdx(
            globalObj.sliderCurIdx + 1 * (directionIsLeft ? -1 : 1),
            globalObj.sliderEntries.length
          );

          globalObj.sliderBusy = false;
        }, globalObj.transition);
      });
    });
  }
  globalObj.sliderBusy = true;
}

function nodesAddClasses(nodes, classes) {
  for (let i = 0; i < classes.length && i < nodes.length; ++i) {
    nodes[i].classList.add(classes[i]);
  }
}

function nodesRemoveClasses(nodes, classes) {
  for (let i = 0; i < classes.length && i < nodes.length; ++i) {
    nodes[i].classList.remove(classes[i]);
  }
}

function pageControlFunc(event) {
  if (scrollIsUp(event.target)) {
    const pageId = formatIdx(
      globalObj.pageSection.current - 1,
      globalObj.sections.length
    );
    scrollToPage(pageId);
  } else {
    const pageId = formatIdx(
      globalObj.pageSection.current + 1,
      globalObj.sections.length
    );
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
      const pageId = formatIdx(
        globalObj.pageSection.current + 1,
        globalObj.sections.length
      );
      scrollToPage(pageId);
    } else if (angle >= 5 * Math.PI / 4 && angle <= 7 * Math.PI / 4) {
      const pageId = formatIdx(
        globalObj.pageSection.current - 1,
        globalObj.sections.length
      );
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
  if (typeof id === `string`) {
    id = globalObj.sections.indexOf(
      globalObj.sections.filter((val) => {
        return val.dataset.name === id;
      })[0]
    );
  }

  if (!globalObj.busy) {
    if (globalObj.pageSection.current === id) return;

    globalObj.busy = true;
    const headerBtn = document.getElementsByClassName(`headerBtn`)[0];

    const animationIsDownwards =
      globalObj.pageSection.current - id === 1 ||
      (id === globalObj.sections.length - 1 &&
        globalObj.pageSection.current === 0);

    deactivatePage(globalObj.pageSection.current, animationIsDownwards);
    activatePage(id, animationIsDownwards);
    if (id !== 0) {
      headerBtn.classList.remove(`inactive`);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          headerBtn.classList.add(`headerBtn_visible`);
        });
      });
    } else {
      headerBtn.classList.remove(`headerBtn_visible`);
      setTimeout(() => {
        headerBtn.classList.add(`inactive`);
      }, globalObj.transition);
    }

    globalObj.pageSection.previous = globalObj.pageSection.current;
    globalObj.pageSection.current = id;

    setTimeout(() => {
      globalObj.busy = false;
    }, globalObj.transition);
  }
  globalObj.busy = true;
}

function activatePage(id, animationIsDownwards) {
  toggleNavigationEntries(id);

  const page = globalObj.sections[id];
  const animationClass = animationIsDownwards
    ? `pageSection_above`
    : `pageSection_below`;

  page.classList.add(animationClass);
  page.classList.add(`pageSection_active`);
  setTimeout(() => {
    page.classList.remove(animationClass);
  }, 50);
}

function deactivatePage(id, animationIsDownwards) {
  toggleNavigationEntries(id);

  const page = globalObj.sections[id];
  const animationClass = animationIsDownwards
    ? `pageSection_below`
    : `pageSection_above`;

  page.classList.add(animationClass);
  page.classList.remove(`pageSection_active`);
  setTimeout(() => {
    page.classList.remove(animationClass);
  }, globalObj.transition);
}

function toggleNavigationEntries(id) {
  const mainMenuEntry = globalObj.mainMenuElements[id];
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
  if (idx < 0) return arrLength + idx;
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
  const mainMenuElements = globalObj.mainMenuElements;
  const isOpeningAnimation = globalObj.page.classList.toggle(
    `pageContainer_zoomedOut`
  );
  setTimeout(() => {
    globalObj.pageReturnArea.classList.toggle(`inactive`);
  }, isOpeningAnimation ? 0 : globalObj.transition);

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
  if (event.deltaY < 0) {
    const pageId = formatIdx(
      globalObj.pageSection.current - 1,
      globalObj.sections.length
    );
    scrollToPage(pageId);
  } else if (event.deltaY > 0) {
    const pageId = formatIdx(
      globalObj.pageSection.current + 1,
      globalObj.sections.length
    );
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

  for (let i = 0; i < entriesSource.length; ++i) {
    const containerCopy = sectionNavLinePointContainer.cloneNode({
      deep: true,
    });

    containerCopy.firstChild.classList.add(`sectionNavLinePoint_active`);
    containerCopy.classList.add(`sectionNavLinePointContainer_active`);

    const sectionName = createElementWithClasses(`div`, `sectionName`);

    const numberSpan = createElementWithClasses(`span`, `sectionName__number`);
    numberSpan.textContent = adjustNumLength(i + 1, 2);
    numberSpan.dataset.idx = i;
    numberSpan.addEventListener(`click`, sectionPointClickEvent);

    const nameSpan = createElementWithClasses(`span`, `sectionName__name`);
    nameSpan.textContent = entriesSource[i].dataset.name;

    sectionName.appendChild(numberSpan);
    sectionName.appendChild(nameSpan);

    containerCopy.appendChild(sectionName);
    container.appendChild(containerCopy);

    if (i < entriesSource.length - 1) {
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

  if (event.target.parentElement.classList.contains(`sectionName_nameShown`)) {
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
