document.body.onload = () => {
  document.body.style.paddingTop = `25px`;

  const elements = document.getElementsByClassName(`scroll-element`);
  for (const entry of elements) {
    entry.style.padding = `1rem 0`;
  }

  const breakpoints = breakpointsFromArr(elements);

  const display = document.getElementById(`scroll-display`);
  display.style = `display: flex;
                 transform: skewX(-45deg);
                 position: fixed;
                 top: -1px;
                 left: -84px;
                 background-color: #444444;
                 padding: 0.25rem 6px 0.25rem 0;
                 box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);`;

  for (let i = -1; i < elements.length; ++i) {
    const displayNode = document.createElement(`div`);

    displayNode.style = `height: 30px;
                   width: 90px;
                   background-color: #444444;
                   margin: 0 6px`;

    if (i === -1) displayNode.style.background = `#ffc400`;
    display.appendChild(displayNode);
  }

  animateScroll();

  function animateScroll() {
    window.requestAnimationFrame(() => {
      const displayNodes = Array.from(display.children);
      displayNodes.shift(1);
      const scroll = pageYOffset + innerHeight;
      for (let i = 0; i < elements.length; ++i) {
        if (scroll + 5 > breakpoints[i]) {
          displayNodes[i].style.backgroundColor = `#ffc400`;
        } else {
          displayNodes[i].style.backgroundColor = `#444444`;
        }
      }
      animateScroll();
    });
  }

  function elementHeight(element) {
    return parseFloat(element.clientHeight);
  }

  function breakpointsFromArr(arr) {
    const result = [];
    let sum = smallestOffset(arr);

    for (const entry of arr) {
      const height = elementHeight(entry);
      sum += height;
      result.push(sum);
    }

    return result;
  }

  function smallestOffset(arr) {
    let tmp = Infinity;

    for (const entry of arr) {
      if (entry.offsetTop < tmp) tmp = entry.offsetTop;
    }

    return tmp;
  }
};
