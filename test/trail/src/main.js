document.body.onload = trailsAnimation();

function trailsAnimation() {
  const trailsState = [
    {
      offsetTop: -60,
      offsetLeft: -60,
    },
  ];

  for (let i = 1; i <= 10; ++i) {
    const trail = document.body.appendChild(document.createElement(`div`));

    trail.style.left = `${(i + 1) * -60}px`;
    trail.style.top = `${(i + 1) * -60}px`;
    trail.style.zIndex = 1;
    trail.className = `trail`;

    trailsState.push(trail);
  }

  window.addEventListener(`mousemove`, trail);
  window.addEventListener(
    `touchmove`,
    (event) => {
      trail({
        pageX: event.touches[0].pageX,
        pageY: event.touches[0].pageY,
      });
      event.preventDefault();
    },
    { passive: false }
  );

  function trail(event) {
    requestAnimationFrame(() => {
      const cursorOffsetLeft = event.pageX;
      const cursorOffsetTop = event.pageY;

      const trailsStateLocal = createLocalState(trailsState);

      for (let i = 1; i < trailsState.length; ++i) {
        const trail = trailsState[i];
        const trailPrev = trailsStateLocal[i - 1];

        const x = trailPrev.offsetLeft - trail.offsetLeft;
        const y = trail.offsetTop - trailPrev.offsetTop;

        const angle = calcAngle(x, y);

        if (i === 1) {
          document.body.style.cursor = chooseCursor(angle);
        }

        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        if (distance < 40) {
          break;
        }

        trail.style.left = trailPrev.offsetLeft + `px`;
        trail.style.top = trailPrev.offsetTop + `px`;

        trail.style.transform = `rotate(${angle * -1 + Math.PI / 2}rad)`;
        trail.style.boxShadow = `${x}px ${y}px 12px 0 #16171844`;
      }

      trailsState[0] = {
        offsetTop: cursorOffsetTop - 30,
        offsetLeft: cursorOffsetLeft - 7.5,
      };
    });
  }

  function createLocalState(state) {
    const local = [];

    for (let i = 0; i < state.length; ++i) {
      local[i] = {
        offsetLeft: state[i].offsetLeft,
        offsetTop: state[i].offsetTop,
      };
    }

    return local;
  }

  function calcAngle(x, y) {
    if (x > 0 && y >= 0) {
      return Math.atan(y / x);
    }
    if (x > 0 && y <= 0) {
      return Math.atan(y / x);
    }
    if (x < 0 && y >= 0) {
      return Math.atan(y / x) + Math.PI;
    }
    if (x < 0 && y <= 0) {
      return Math.atan(y / x) + Math.PI;
    }

    if (x === 0) {
      if (y > 0) return Math.PI / 2;
      if (y < 0) return 3 * Math.PI / 2;
    }

    return 0;
  }

  function chooseCursor(angle) {
    const section = Math.PI / 8;
    angle = angle % Math.PI;
    switch (Math.floor(angle / section)) {
      case 0:
      case 7:
        return `ew-resize`;

      case 1:
      case 2:
        return `nesw-resize`;

      case 3:
      case 4:
        return `ns-resize`;

      case 5:
      case 6:
        return `nwse-resize`;
    }
  }
}
