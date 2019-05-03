document.body.onload = () => {
  const shapeFunctions = {
    trapezoid: function(altitude, a, b, cx) {
      cx.lineWidth = 2;
      cx.clearRect(0, 0, 300, 300);
      const currentX = 150;
      const currentY = 150;

      cx.beginPath();
      cx.moveTo(currentX - a / 2, currentY - altitude / 2);
      cx.lineTo(currentX + a / 2, currentY - altitude / 2);
      cx.lineTo(currentX + b / 2, currentY + altitude / 2);
      cx.lineTo(currentX - b / 2, currentY + altitude / 2);
      cx.lineTo(currentX - a / 2, currentY - altitude / 2);
      cx.stroke();
    },
    redDiamond: function(diagonal, angle, cx) {
      cx.clearRect(0, 0, 300, 300);
      cx.beginPath();
      const width = Math.sqrt(diagonal ** 2 / 2);
      cx.fillStyle = `#f00`;
      cx.save();
      cx.translate(150, 150);
      cx.rotate(angle * Math.PI / 180);
      cx.rect(-width / 2, -width / 2, width, width);
      cx.restore();
      cx.fill();
    },
    zigZagLine: function(stepSize, cx) {
      cx.lineWidth = 2;
      cx.clearRect(0, 0, 300, 300);
      let currentX = 0;
      let currentY = 0;

      cx.beginPath();
      do {
        cx.lineTo(currentX, currentY);
        currentX += currentX === 300 ? -300 : 300;
        currentY += stepSize;
      } while (currentY <= 300 + stepSize);
      cx.stroke();
    },
    spiral: function(step, quality, cx) {
      cx.clearRect(0, 0, 300, 300);
      step /= quality;
      let radius = 0;
      let currentX = 150;
      let currentY = 150;
      let angle = -Math.PI;

      cx.beginPath();
      cx.moveTo(currentX, currentY);
      while (
        currentX <= 375 &&
        currentX >= -75 &&
        currentY >= -75 &&
        currentY <= 375
      ) {
        currentX += Math.sin(angle) * -radius;
        currentY += Math.cos(angle) * radius;
        angle += Math.PI / quality;
        radius += step / quality;
        cx.lineTo(currentX, currentY);
      }
      cx.stroke();
    },
    star: function(radius, spikes, spikeRatio, cx) {
      cx.clearRect(0, 0, 300, 300);
      const currentX = 150;
      const currentY = 150;
      cx.fillStyle = `#FFA500`;

      cx.beginPath();
      for (
        let angle = -Math.PI / 2;
        angle < Math.PI * 1.5;
        angle += Math.PI / 1440
      ) {
        const curRadius =
          radius -
          ellipseHalfEquation(
            angle + Math.PI / 2,
            radius * spikeRatio,
            Math.round(spikes)
          );
        cx.lineTo(
          currentX + Math.cos(angle) * curRadius,
          currentY + Math.sin(angle) * curRadius
        );
      }
      cx.fill();

      function ellipseHalfEquation(angle, radius, spikes) {
        const pi = Math.PI;
        angle %= pi * 2 / spikes;
        return (
          radius /
          pi *
          Math.sqrt(pi ** 2 - ((angle - pi / spikes) * spikes) ** 2)
        );
      }
    },
  };
  const shapeObjects = {};
  const circles = document.querySelectorAll(`.slider__circle`);
  const containers = document.querySelectorAll(`.shapeContainer`);

  for (const container of containers) {
    const name = `${container.dataset.shapeName}`;
    const obj = Object.create(null);
    const controls = container.lastElementChild;
    const cxt = container.firstElementChild.getContext(`2d`);

    obj.argsDefault = [];
    obj.args = [];
    for (const slider of controls.children) {
      const min = Number(slider.lastElementChild.dataset.minValue);
      const max = Number(slider.lastElementChild.dataset.maxValue);

      obj.args.push((min + max) / 2);
      obj.argsDefault.push([min, max]);

      const name = slider.firstElementChild;
      const text = name.firstChild;
      const minSpan = document.createElement(`span`);
      minSpan.classList.add(`name__minMaxVal`);
      const maxSpan = minSpan.cloneNode();

      minSpan.textContent = min;
      maxSpan.textContent = max;

      name.insertBefore(minSpan, text);
      name.appendChild(maxSpan);
    }
    obj.args.push(cxt);
    obj.func = shapeFunctions[name];

    shapeObjects[`${container.dataset.shapeName}`] = obj;
    drawShape(obj);
  }

  for (const circle of circles) {
    circle.addEventListener(`mousedown`, (event) => {
      let busy = false;
      const target = event.target;
      const container =
        target.parentElement.parentElement.parentElement.parentElement;
      const controls = Array.from(container.lastElementChild.children);
      const name = container.dataset.shapeName;
      const index = controls.indexOf(target.parentElement.parentElement);

      const initialX =
        target.style.left === ``
          ? event.clientX - 135
          : event.clientX - parseInt(target.style.left);
      const width = 270;

      event.preventDefault();

      document.addEventListener(`mouseup`, mouseUpEvent);
      document.addEventListener(`mousemove`, mouseMoveEvent);

      function mouseUpEvent(event) {
        document.removeEventListener(`mousemove`, mouseMoveEvent);
        document.removeEventListener(`mouseup`, mouseUpEvent);
      }

      function mouseMoveEvent(event) {
        if (!busy) {
          window.requestAnimationFrame(() => {
            const obj = shapeObjects[name];
            const [min, max] = obj.argsDefault[index];
            const diff = max - min;

            const currentX = event.clientX;
            let left = 0;

            if (currentX >= initialX) {
              if (currentX > initialX + width) {
                left = width;
              } else {
                left = currentX - initialX;
              }
            }

            const ratio = left / width;
            obj.args[index] = min + diff * ratio;

            drawShape(obj);

            target.style.left = `${left}px`;
            busy = false;
          });
        }
        busy = true;
      }
    });
  }

  function drawShape(obj) {
    obj.func(...obj.args);
  }
};
