"use strict";

// TODO: Create a CPU to play against that checks all the potential win scenarios and blocks the highest chance of winning and at the same time picks a location that increases its win chance. Then allow the user to select PvP or PvCPU and also let the user select if they want to let the CPU begin the game as X or if they want the CPU to be O.

// Add a button to turn on the CPU then create an if statement that checks if that option is turned on or not.

const tiles = document.querySelectorAll(".board-tile");
const description = document.querySelector(".description");
const playerOneImg = document.querySelector("#player-1-img");
const scorePlayerOne = document.querySelector("#player--1");
const scorePlayerTwo = document.querySelector("#player--2");
const cpu = document.querySelector("#cpu");
const cpuScore = document.querySelector("#cpu-score");
const tieScore = document.querySelector("#tie-score");
const winnerText = document.querySelector("#text");
const overlay = document.querySelector("#overlay");
const playAgain = document.querySelector("#rematch");
const normal = document.querySelector("#normal");
const noStealWins = document.querySelector("#no-steal-wins");
const twoRoundSteals = document.querySelector("#delayed-steal");

const cpuTiles1 = [5, 6, 9, 10];

const win1 = [0, 1, 2, 3];
const win2 = [4, 5, 6, 7];
const win3 = [8, 9, 10, 11];
const win4 = [12, 13, 14, 15];
const win5 = [0, 4, 8, 12];
const win6 = [1, 5, 9, 13];
const win7 = [2, 6, 10, 14];
const win8 = [3, 7, 11, 15];
const win9 = [0, 5, 10, 15];
const win10 = [3, 6, 9, 12];

let winIndex = [];

let offensiveDict = {};
let defensiveDict = {};

winIndex.push(win1, win2, win3, win4, win5, win6, win7, win8, win9, win10);

let playerOne = true;
let bot = false;
let skipTheRest = false;
let waitForNewGame = false;
let waitToChangeTileIndex = 0;
let turn = 0;
let randomNumber = 0;
let playerOneWon = 0;
let square;

// Overlay functions

const on = function () {
  document.getElementById("overlay").style.display = "block";
};

const off = function () {
  document.getElementById("overlay").style.display = "none";
};

// Tile manipulation functions

const clearAllTileContents = function () {
  tiles.forEach((thing) => {
    thing.textContent = "";
  });
};

const changeTileContents = function (tile, str) {
  tile.textContent = str;
};

const changeTileBackgroundColor = function (thing, color) {
  thing.style.backgroundColor = color;
};

const removeAllTileBackgroundColor = function () {
  tiles.forEach((thing) => {
    if (thing.style.backgroundColor !== "green")
      thing.style.backgroundColor = "";
  });
};

const colorWinningTilesRed = function (index) {
  winIndex[index].forEach((ind) => {
    tiles[ind].style.backgroundColor = "red";
  });
};

const makeTilesBlue = function (letter = "X") {
  const noWinsOffSteals = document.querySelector("#no-steal-wins").checked;
  let count;
  let indices = [];
  let otherLetter;

  if (letter === "X") {
    otherLetter = "O";
  } else {
    otherLetter = "X";
  }

  tiles.forEach((thing) => {
    if (thing.textContent === letter && !noWinsOffSteals) {
      thing.style.backgroundColor = "blue";
    } else if (thing.textContent === letter && noWinsOffSteals) {
      thing.style.backgroundColor = "blue";
      count = countXsOrOs(otherLetter);
      indices = getIndicesOfValueInArray(count, 3);
      removeWinningBlueTilesNWOS(indices, letter);
      console.log(`Indeces: ${indices}`);
    }
  });
};

const removeWinningBlueTilesNWOS = function (indices, letter) {
  for (let i = 0; i < indices.length; i++) {
    winIndex[indices[i]].forEach((index) => {
      if (tiles[index].textContent === letter) {
        tiles[index].style.backgroundColor = "";
      }
    });
  }
};

const removeGreenTileDS = function () {
  tiles.forEach((thing) => {
    if (thing.style.backgroundColor === "green")
      thing.style.backgroundColor = "";
  });
};

// Array manipulation functions

const getIndicesOfValueInArray = function (arr, val) {
  let indices = [];
  let i;
  for (i = 0; i < arr.length; i++) if (arr[i] === val) indices.push(i);
  return indices;
};

const populateArrayWithPossibleMoves = function (defensiveMoves) {
  let possibleMoveIndeces = [];
  for (const [index, element] of defensiveMoves.entries()) {
    if (element > 0) {
      for (let j = 0; j < element; j++) {
        for (let i = 0; i < 4; i++) {
          if (
            tiles[winIndex[index][i]].textContent === "" ||
            tiles[winIndex[index][i]].style.backgroundColor === "blue"
          ) {
            possibleMoveIndeces.push(winIndex[index][i]);
            if (tiles[winIndex[index][i]].style.backgroundColor === "blue") {
              possibleMoveIndeces.push(winIndex[index][i]);
            }
          }
        }
      }
    }
  }
  return possibleMoveIndeces;
};

const countXsOrOs = function (letter) {
  let moves = [];
  let count = 0;

  for (let x = 0; x < 10; x++) {
    count = 0;
    for (let y = 0; y < 4; y++) {
      let index = winIndex[x][y];
      if (tiles[index].textContent === letter) {
        count++;
      }
    }
    moves.push(count);
  }
  return moves;
};

// Game ending and restarting functions

const newWinner = function () {
  waitForNewGame = false;
  playAgain.style.display = "none";
  clearAllTileContents();
  removeAllTileBackgroundColor();
  removeGreenTileDS();
  playerOne = true;
  skipTheRest = false;
  playerOneImg.style.backgroundColor = "green";
  playerTwoImg.style.backgroundColor = "";
  turn = 0;
  randomNumber = 0;
  playerOneWon = 0;
  square = "";
};

const winnerDisplay = function (winnerMessage, scoreTag, index = 0) {
  waitForNewGame = true;
  console.log(winnerMessage);
  scoreTag.textContent = Number(scoreTag.textContent) + 1;
  winnerText.textContent = winnerMessage;
  on();
  playAgain.style.display = "block";
  removeAllTileBackgroundColor();
  if (index) {
    colorWinningTilesRed(index);
  }
};

const winnerCheck = function () {
  let count = 0;
  let x;
  let y;
  let index;

  for (x = 0; x < 10; x++) {
    let countOs = 0;
    let countXs = 0;
    for (y = 0; y < 4; y++) {
      index = winIndex[x][y];
      if (tiles[index].textContent === "X") {
        countXs++;
      } else if (tiles[index].textContent === "O") {
        countOs++;
      }
      if (countXs === 4) {
        let msg = "Player 1 has won the game!";
        winnerDisplay(msg, scorePlayerOne, x);
        return 1;
      } else if (countOs === 4 && bot === false) {
        let msg = "Player 2 has won the game!";
        winnerDisplay(msg, scorePlayerTwo, x);
        return 0;
      } else if (countOs === 4 && bot === true) {
        let msg = "CPU has won the game!";
        winnerDisplay(msg, cpuScore, x);
        return 0;
      }
    }
  }

  tiles.forEach((thing) => {
    if (thing.textContent === "X" || thing.textContent === "O") {
      count++;
    }
    if (count === 16) {
      let msg = "Tie Game!";
      winnerDisplay(msg, tieScore);
      return 0;
    }
  });
};

const loseConCheck = function () {
  let countXs = 0;
  let countGreenOs = 0;
  let clickCount = 0;
  let tile, index;

  if (!skipTheRest) {
    for (let x = 0; x < 10; x++) {
      if (!skipTheRest) {
        countXs = 0;
        countGreenOs = 0;
        clickCount = 0;
        for (let y = 0; y < 4; y++) {
          index = winIndex[x][y];
          tile = tiles[index];
          if (tile.textContent === "X") {
            countXs++;
          } else if (
            tile.textContent === "O" &&
            tile.style.backgroundColor === "green"
          ) {
            countGreenOs++;
          }
        }
        if (countXs === 3 || (countXs >= 2 && countGreenOs === 1)) {
          winIndex[x].forEach((ind) => {
            tile = tiles[ind];
            if (
              tile.textContent === "X" &&
              tile.style.backgroundColor === "blue" &&
              clickCount === 0
            ) {
              skipTheRest = true;
              changeTileContents(tile, "O");
              clickCount++;
            }
          });

          winIndex[x].forEach((ind) => {
            tile = tiles[ind];
            if (tile.textContent === "" && clickCount === 0) {
              skipTheRest = true;
              changeTileContents(tile, "O");
              clickCount++;
            }
          });

          winIndex[x].forEach((ind) => {
            tile = tiles[ind];
            if (tile.textContent === "O" && clickCount === 0) {
              skipTheRest = false;
            }
          });
        }
      }
    }
  }
};

const winConCheck = function () {
  let countOs = 0;
  let clickCount = 0;
  let index, tile;

  if (!skipTheRest) {
    for (let x = 0; x < 10; x++) {
      if (!skipTheRest) {
        countOs = 0;
        clickCount = 0;
        for (let y = 0; y < 4; y++) {
          index = winIndex[x][y];
          tile = tiles[index];
          if (
            tile.textContent === "O" &&
            tile.style.backgroundColor !== "green"
          ) {
            countOs++;
          }
        }
        if (countOs === 3) {
          winIndex[x].forEach((ind) => {
            tile = tiles[ind];
            if (
              tile.textContent === "X" &&
              tile.style.backgroundColor === "blue" &&
              clickCount === 0
            ) {
              skipTheRest = true;
              changeTileContents(tile, "O");
              clickCount++;
            }
          });

          winIndex[x].forEach((ind) => {
            tile = tiles[ind];
            if (tile.textContent === "" && clickCount === 0) {
              skipTheRest = true;
              changeTileContents(tile, "O");
              clickCount++;
            }
          });

          winIndex[x].forEach((ind) => {
            tile = tiles[ind];
            if (tile.textContent === "X" && clickCount === 0) {
              skipTheRest = false;
            }
          });
        }
      }
    }
  }
};

// Bot functions

const botMove = function () {
  iconBackgroundColorChange(cpu);
  if (turn === 1) {
    botRoundOneMove();
  } else {
    botCheck();
  }
  playerOne = true;
};

const botCheck = function () {
  // If the bot will not lose and has 2 O's in a win condition with the third position open, take it

  let possibleMoveIndeces = [];
  let defensiveMoves = [];
  let nextMoveIndex;

  // Check if the bot has a way to win
  winConCheck();

  // Check if the boy has a way to lose
  loseConCheck();

  // If the bot is not about to lose or win, check if there are two Os with either two empty spots next to it or an empty spot and a stealable X
  botAgressiveMove();

  // If the bot cannot win and cannot lose make a player that is defensive
  if (!skipTheRest) {
    defensiveMoves = countXsOrOs("X");
    possibleMoveIndeces = populateArrayWithPossibleMoves(defensiveMoves);
    nextMoveIndex = botFindNextMove(possibleMoveIndeces);
    tiles[nextMoveIndex].textContent = "O";
    winnerCheck();
  }

  removeAllTileBackgroundColor();
  if (turn % 2 === 0 && document.querySelector("#delayed-steal").checked) {
    makeTilesBlue("O");
  } else if (
    turn % 3 === 0 &&
    !document.querySelector("#delayed-steal").checked
  ) {
    makeTilesBlue("O");
  }

  skipTheRest = false;
};

const botAgressiveMove = function () {
  let countOs;
  let countOpenTiles;
  let index;
  let tile;
  let countGreenOs;
  let clickCount;

  if (!skipTheRest) {
    for (let x = 0; x < 10; x++) {
      if (!skipTheRest) {
        countOs = 0;
        countOpenTiles = 0;
        countGreenOs = 0;
        clickCount = 0;

        for (let y = 0; y < 4; y++) {
          index = winIndex[x][y];
          tile = tiles[index];
          if (
            tile.textContent === "O" &&
            tile.style.backgroundColor !== "green"
          ) {
            countOs++;
          } else if (
            (tile.textContent === "X" &&
              tile.style.backgroundColor === "blue") ||
            tile.textContent === ""
          ) {
            countOpenTiles++;
          } else if (
            tile.textContent === "O" &&
            tile.style.backgroundColor === "green"
          ) {
            countGreenOs++;
          }
        }

        if (countOpenTiles >= 1 && countOs === 2 && countGreenOs === 0) {
          for (let y = 0; y < 4; y++) {
            index = winIndex[x][y];
            tile = tiles[index];
            if (
              tile.textContent === "X" &&
              tile.style.backgroundColor === "blue" &&
              clickCount === 0
            ) {
              changeTileContents(tile, "O");
              skipTheRest = true;
              clickCount++;
            } else if (tile.textContent === "" && clickCount === 0) {
              changeTileContents(tile, "O");
              skipTheRest = true;
              clickCount++;
            }
          }
        }
      }
    }
  }
};

const botFindNextMove = function (moveCount) {
  let mf = 1;
  let m = 0;
  let tile;
  for (let i = 0; i < moveCount.length; i++) {
    for (let j = i; j < moveCount.length; j++) {
      if (moveCount[i] == moveCount[j]) m++;
      if (mf < m) {
        mf = m;
        tile = moveCount[i];
      }
    }
    m = 0;
  }
  return tile;
};

const botRoundOneMove = function () {
  let tileContainer = [];
  for (let x = 0; x < cpuTiles1.length; x++) {
    square = tiles[cpuTiles1[x]];
    if (square.textContent === "") {
      tileContainer.push(square);
    }
  }
  randomNumber = Math.trunc(Math.random() * tileContainer.length);
  tileContainer[randomNumber].textContent = "O";
};

// Icon functions

const iconBackgroundColorChange = function (emptyIcon) {
  changeTileBackgroundColor(emptyIcon, "");
  if (bot === true && !playerOne) {
    changeTileBackgroundColor(playerOneImg, "green");
    changeTileBackgroundColor(cpu, "white");
  } else if (bot === false && !playerOne) {
    changeTileBackgroundColor(playerOneImg, "green");
  }
};

// Base game functions

const normalGame = function (tile) {
  // Change the tile from empty to X or blue O to X
  if (
    playerOne &&
    (tile.textContent === "" || tile.style.backgroundColor === "blue")
  ) {
    // Increase the turn
    turn++;

    // Change the icon background color for the turn
    iconBackgroundColorChange(playerOneImg);

    // Change the tile contents
    changeTileContents(tile, "X");

    // Check if player one won
    playerOneWon = winnerCheck();

    // Remove the tiles background color unless it is green
    removeAllTileBackgroundColor();

    // Make the X's blue on the third turn if player one has not won
    if (!playerOneWon && turn % 3 === 0) {
      makeTilesBlue("X");
    }

    // Make it not player one's turn
    playerOne = false;

    // Enable the cpu's turn if player one has not won
    if (bot === true && !playerOneWon) {
      botMove();
      playerOneWon = winnerCheck();
    }

    // Change the tile from empty to O or blue X to O
  } else if (
    !playerOne &&
    (tile.textContent === "" || tile.style.backgroundColor === "blue") &&
    bot === false
  ) {
    // Change background color of icon
    iconBackgroundColorChange(playerTwoImg);

    // Change tile to an O
    changeTileContents(tile, "O");

    // Check for a winner
    playerOneWon = winnerCheck();

    // Remove all the tile background color besides green
    removeAllTileBackgroundColor();

    // Color the O's blue every third action
    if (turn % 3 === 0 && !playerOneWon) {
      makeTilesBlue("O");
    }

    // Make it not player two's turn
    playerOne = true;
  }
};

const delayedGame = function (tile) {
  // Start

  // This function is triggered by a click on a tile
  if (playerOne && tile.textContent === "") {
    // Increase the turn
    turn++;

    // Change the icon background color for the turn
    iconBackgroundColorChange(playerOneImg);

    // Change the tile contents
    changeTileContents(tile, "X");

    // Check if player one won
    playerOneWon = winnerCheck();

    // Remove the tiles background color unless it is green
    removeAllTileBackgroundColor();

    // Make the X's blue on the third turn if player one has not won
    if (!playerOneWon && turn % 2 === 0) {
      makeTilesBlue("X");
    }

    // Make it not player one's turn
    playerOne = false;

    // Run the CPU turn if player one has not won
    if (bot === true && !playerOneWon) {
      botMove();
      playerOneWon = winnerCheck();
    }

    // End
  } else if (
    tile.style.backgroundColor === "blue" &&
    tile.textContent === "O"
  ) {
    // Increase the turn
    turn++;

    // Change the icon background color for the turn
    iconBackgroundColorChange(playerOneImg);

    // Change the tile contents
    changeTileContents(tile, "X");

    // Check if player one won
    playerOneWon = winnerCheck();

    // Remove the tiles background color unless it is green
    removeAllTileBackgroundColor();

    // Make the X's blue on the third turn if player one has not won
    if (!playerOneWon && turn % 2 === 0) {
      makeTilesBlue("X");
    }

    // Make it not player one's turn
    playerOne = false;

    // Run the CPU turn if player one has not won
    if (bot === true && !playerOneWon) {
      botMove();
      playerOneWon = winnerCheck();
    }

    // end
  } else if (
    !playerOne &&
    (tile.textContent === "" || tile.style.backgroundColor === "blue") &&
    bot === false
  ) {
    // Change the icon background color
    iconBackgroundColorChange(playerTwoImg);

    // Change the tile content to an O
    changeTileContents(tile, "O");

    // Check for a winner
    playerOneWon = winnerCheck();

    // Remove the tiles background color unless it is green
    removeAllTileBackgroundColor();

    // Make the X's blue on the third turn if player one has not won
    if (!playerOneWon && turn % 2 === 0) {
      makeTilesBlue("O");
    }

    // Send the turn back to player one
    playerOne = true;
  }
};

// On radiobutton click change the description

const changeDescription = function (myRadio) {
  let description = document.querySelector(".description");
  if (myRadio.id === "normal") {
    description.innerHTML =
      "Get four in a row and win.<br />Steals occur every third round.";
  } else if (myRadio.id === "no-steal-wins") {
    description.innerHTML =
      "Get four in a row and win.<br />Steals occur every third round.<br />No winning off steals.";
  } else if (myRadio.id === "delayed-steal") {
    description.innerHTML =
      "Get four in a row and win.<br />Steals occur every second round.";
  }
};

// Listening for a click on the bot icon

cpu.addEventListener("click", function () {
  if (bot === false) {
    bot = true;
    cpu.style.backgroundColor = "white";
    cpu.style.border = "solid";
    cpu.style.borderColor = "blue";
  } else {
    bot = false;
    cpu.style.backgroundColor = "";
    cpu.style.border = "";
  }
});

// Listening for a click on a tile

document.querySelectorAll(".board-tile").forEach((tile) => {
  tile.addEventListener("click", (e) => {
    if (!waitForNewGame) {
      if (
        document.querySelector("#normal").checked ||
        document.querySelector("#no-steal-wins").checked
      ) {
        normalGame(tile);
      } else {
        delayedGame(tile);
      }
    }
  });
});

// Clearing contents before game begins

clearAllTileContents();

playerOneImg.style.backgroundColor = "green";
