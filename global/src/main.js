document.body.onload = () => {
  const page = document.getElementsByClassName(`pageContainer`)[0];
  const mainMenuBtn = document.getElementsByClassName(`mainMenuBtn`)[0];
  const mainMenu = document.getElementsByClassName(`mainMenu`)[0];

  mainMenuBtn.addEventListener(`click`, (e) => {
    page.classList.toggle(`pageContainer_zoomedOut`);
    mainMenu.classList.toggle(`mainMenu_visible`);
    e.stopPropagation;
  });
};
