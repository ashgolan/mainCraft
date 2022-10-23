const gameSpace = document.querySelector("#game-board");
const changeMode = document.querySelector("#change-mode");
const startGame = document.querySelector(".startGame");
const restartGame = document.querySelector(".restartGame");
const bigContainer = document.querySelector(".big-container");
const homePage = document.querySelector(".homepage");
const tools = document.querySelectorAll(".tool");
const saving = document.querySelectorAll(".saving");
const toolsList = document.querySelector(".tools-list");
const game = {
  startPointOfSoilX: null,
  startPointOftrunk: null,
  startPointOfStones: null,
  lenOfTrunk: null,
  selectedTool: null,
  selectedSaved: null,
  inventory: {
    leaves: 0,
    trunk: 0,
    stone: 0,
    soil: 0,
    grass: 0,
  },
  tools: {
    shovel: ["soil", "grass"],
    axe: ["leaves", "trunk"],
    pickaxe: ["stone"],
  },
};

const randomNumAtoB = (a, b) => {
  return a + Math.floor(Math.random() * (b + 1 - a));
};
const resetContainers = function () {
  game.startPointOfSoilX = null;
  game.startPointOftrunk = null;
  game.startPointOfStones = null;
  game.lenOfTrunk = null;
  game.selectedTool = null;
  game.selectedSaved = null;
  game.inventory = {
    leaves: 0,
    trunk: 0,
    stone: 0,
    soil: 0,
    grass: 0,
  };
  for (let i in game.inventory) {
    const itemInInventory = document.getElementById(`${i}`);
    itemInInventory.style.backgroundImage = `url('/images/${i}.jpg')`;
    itemInInventory.textContent = "0";
  }
};

const generateDivIDs = () => {
  gameSpace.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 30; j++) {
      let newDiv = document.createElement("div");
      newDiv.setAttribute("id", `(${j},${i})`);
      gameSpace.appendChild(newDiv);
    }
  }
};

const getElementByIdF = (x, y) => {
  return document.getElementById(`(${x},${y})`);
};
const createSoil = () => {
  game.startPointOfSoilX = randomNumAtoB(14, 16);
  for (let i = game.startPointOfSoilX; i < 20; i++) {
    for (let j = 0; j < 30; j++) {
      const soilPoint = getElementByIdF(j, i);
      soilPoint.classList.add("soil");
    }
  }
};

const createTopSoil = () => {
  for (let i = 0; i < 30; i++) {
    const topSoilPoint = getElementByIdF(i, game.startPointOfSoilX - 1);
    topSoilPoint.classList.add("grass");
  }
};

const createTrunk = () => {
  game.lenOfTrunk = randomNumAtoB(2, 4);
  game.startPointOftrunk = randomNumAtoB(5, 25);

  for (let i = 0; i < game.lenOfTrunk; i++) {
    let startCell = getElementByIdF(
      game.startPointOftrunk,
      game.startPointOfSoilX - (i + 2)
    );

    startCell.classList.add("trunk");
  }
};

const createLeaves = function (x, y, trunkLen) {
  x = game.startPointOftrunk;
  y = game.startPointOfSoilX - 2 - game.lenOfTrunk;
  trunkLen = game.lenOfTrunk;

  counter = 0;
  let greenLength = trunkLen * 2 + 1;
  for (let i = 0; i <= trunkLen; i++) {
    for (let j = 0; j < greenLength; j++) {
      tree = getElementByIdF(x - trunkLen + i + j, y - counter);
      tree.classList.add("leaves");
    }
    greenLength = greenLength - 2;
    if (counter <= 4) counter++;
  }
};

const createStones = () => {
  const lenOfStones = randomNumAtoB(2, game.lenOfTrunk);
  if (game.startPointOftrunk - 0 > 30 - game.startPointOftrunk) {
    game.startPointOfStones = randomNumAtoB(
      3,
      game.startPointOftrunk - game.lenOfTrunk
    );
  } else
    game.startPointOfStones = randomNumAtoB(
      game.startPointOftrunk + game.lenOfTrunk,
      25
    );

  counter = 2;
  for (let i = 0; i <= lenOfStones; i++) {
    for (let j = 0; j < lenOfStones; j++) {
      const stone = getElementByIdF(
        game.startPointOfStones + j,
        game.startPointOfSoilX - counter
      );
      stone.classList.add("stone");
    }
    if (counter <= lenOfStones) counter++;
  }
};

const createWorld = function () {
  resetContainers();
  generateDivIDs();
  addClickEventsToCells();
  createSoil();
  createTopSoil();
  createTrunk();
  createLeaves();
  createStones();
  emptySelectionOfTools();
  toolEvents();
  savingEvents();
};

const restart = function () {
  createWorld();
};

const changingMode = function (e) {
  let backgroundUrl =
    e.target.value > 1
      ? `url("/images/nigthSky2.jpg")`
      : `url("/images/sky.jpg")`;
  gameSpace.style.backgroundImage = backgroundUrl;
};
const addClickEvents = () => {
  restartGame.addEventListener("click", restart);
  changeMode.addEventListener("change", changingMode);
};

addClickEvents();

const checkAndSelect = function (e) {
  if (e.getAttribute("class")) {
    if (game.selectedTool) {
      const thisClass = e.getAttribute("class");
      if (game.tools[game.selectedTool].includes(thisClass)) {
        game.inventory[thisClass]++;
        const addImg = document.getElementById(`${thisClass}`);
        addImg.style.backgroundImage = `url('/images/${thisClass}.jpg')`;
        addImg.textContent = game.inventory[thisClass];
        e.classList.remove(thisClass);
      }
    }
  } else if (game.selectedSaved && game.inventory[game.selectedSaved] > 0) {
    e.classList.add(game.selectedSaved);
    game.inventory[game.selectedSaved]--;
    const getTheSavedElement = document.getElementById(game.selectedSaved);
    getTheSavedElement.textContent--;
  }
};

const emptySelectionOfTools = function () {
  tools.forEach((t) => {
    t.style.backgroundImage = `url("/images/${t.id}.png")`;
    game.selectedTool = null;
  });
  saving.forEach((e) => {
    game.selectedSaved = null;
    e.style.border = "1px white solid";
  });
};
const toolEvents = function () {
  tools.forEach((tool) => {
    tool.addEventListener("click", function () {
      emptySelectionOfTools(tool.class);
      tool.style.backgroundImage = `url("/images/${tool.id}selected.png")`;
      game.selectedTool = tool.id;
    });
  });
};
const addClickEventsToCells = function () {
  const childsOfGrid = [...gameSpace.children];
  childsOfGrid.forEach((e) => {
    e.addEventListener("click", function () {
      checkAndSelect(e);
    });
  });
};
const savingEvents = function () {
  saving.forEach((sTool) => {
    sTool.addEventListener("click", function () {
      if (game.inventory[sTool.id] > 0) {
        emptySelectionOfTools();
        game.selectedSaved = sTool.id;
        sTool.style.borderRight = "5px rgb(238, 45, 45) solid";
      }
    });
  });
};

const start = function () {
  startGame.addEventListener("click", function () {
    homePage.style.display = "none";
    bigContainer.style.display = "flex";
    createWorld();
  });
};

start();
