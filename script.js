"use strict";

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
const hammer = document.querySelector("#impact");

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
let currentStateOfTiles = [];
let currentWinIndex = [];

let offensiveDict = {};
let defensiveDict = {};

winIndex.push(win1, win2, win3, win4, win5, win6, win7, win8, win9, win10);

let playerOne = true;
let bot = true;
let skipTheRest = false;
let waitForNewGame = false;
let waitToChangeTileIndex = 0;
let turn = 0;
let randomNumber = 0;
let playerOneWon = 0;
let playerTwoWon = 0;
let botWon = 0;
let square;
let click = 0;

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
  if (hammer) {
    hammer.currentTime = 0;
    hammer.play();
  }
};

const changeTileBackgroundColor = function (thing, color) {
  thing.style.backgroundColor = color;
};

const removeAllTileBackgroundColor = function () {
  tiles.forEach((thing) => {
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

const getStateOfTiles = function () {
  currentStateOfTiles = [];
  tiles.forEach((thing) => {
    if (thing.textContent === "") {
      currentStateOfTiles.push("");
    } else if (thing.textContent === "O") {
      currentStateOfTiles.push("O");
    } else if (thing.textContent === "X") {
      currentStateOfTiles.push("X");
    }
  });
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
  turn = 0;
  randomNumber = 0;
  playerOneWon = 0;
  playerTwoWon = 0;
  botWon = 0;
  square = "";
};

const winnerDisplay = function (winnerMessage, scoreTag, index) {
  waitForNewGame = true;
  removeAllTileBackgroundColor();
  console.log(winnerMessage);
  scoreTag.textContent = Number(scoreTag.textContent) + 1;
  winnerText.textContent = winnerMessage;
  on();
  playAgain.style.display = "block";
  console.log(`Index value: ${index}`);
  if (index >= 0) {
    console.log(`Got into the index`);
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
        let msg = "Player X has won the game!";
        winnerDisplay(msg, scorePlayerOne, x);
        return 1;
      } else if (countOs === 4 && bot === false) {
        let msg = "Player O has won the game!";
        console.log(x);
        winnerDisplay(msg, cpuScore, x);
        return 2;
      } else if (countOs === 4 && bot === true) {
        let msg = "CPU has won the game!";
        winnerDisplay(msg, cpuScore, x);
        return 3;
      }
    }
  }

  tiles.forEach((thing) => {
    if (thing.textContent === "X" || thing.textContent === "O") {
      count++;
    }
    if (count === 16) {
      let msg = "Tie Game!";
      winnerDisplay(msg, tieScore, -1);
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
  }

  botWon = winnerCheck();

  if (botWon !== 3) {
    removeAllTileBackgroundColor();
  }

  if (
    turn % 2 === 0 &&
    document.querySelector("#delayed-steal").checked &&
    botWon !== 3
  ) {
    makeTilesBlue("O");
  } else if (
    turn % 3 === 0 &&
    !document.querySelector("#delayed-steal").checked &&
    botWon !== 3
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
  let clickCount;

  if (!skipTheRest) {
    for (let x = 0; x < 10; x++) {
      if (!skipTheRest) {
        countOs = 0;
        countOpenTiles = 0;
        clickCount = 0;
        for (let y = 0; y < 4; y++) {
          index = winIndex[x][y];
          tile = tiles[index];
          if (tile.textContent === "O") {
            countOs++;
          } else if (
            (tile.textContent === "X" &&
              tile.style.backgroundColor === "blue") ||
            tile.textContent === ""
          ) {
            countOpenTiles++;
          }
        }
        if (countOpenTiles >= 1 && countOs === 2) {
          console.log(
            `Open Tiles: ${countOpenTiles}\nTiles with O's: ${countOs}`
          );
          let blueXIndex, emptySpaceIndex;
          console.log("Got in here");
          for (let y = 0; y < 4; y++) {
            index = winIndex[x][y];
            tile = tiles[index];
            if (
              tile.textContent === "X" &&
              tile.style.backgroundColor === "blue" &&
              clickCount === 0
            ) {
              blueXIndex = index;
            } else if (tile.textContent === "" && clickCount === 0) {
              emptySpaceIndex = index;
            }
          }
          if (blueXIndex) {
            skipTheRest = true;
            changeTileContents(tiles[blueXIndex], "O");
            clickCount++;
          } else if (emptySpaceIndex) {
            skipTheRest = true;
            changeTileContents(tiles[emptySpaceIndex], "O");
            clickCount++;
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

const changePlayer = function (botImgObj) {
  if (botImgObj.id === "cpu") {
    botImgObj.src = botImgObj.src.slice(0, -7) + "businessman.png";
    botImgObj.id = "player--2";
    document.querySelector("#cpu-score").textContent = "0";
  } else if (botImgObj.id === "player--2") {
    botImgObj.src = botImgObj.src.slice(0, -15) + "bot.png";
    botImgObj.id = "cpu";
    document.querySelector("#cpu-score").textContent = "0";
  }
  bot = !bot;
};

// Icon functions

const iconBackgroundColorChange = function (emptyIcon) {
  changeTileBackgroundColor(emptyIcon, "");
  if (bot === true && !playerOne) {
    changeTileBackgroundColor(playerOneImg, "green");
  } else if (bot === false && !playerOne) {
    changeTileBackgroundColor(playerOneImg, "green");
  } else if (bot === false && playerOne) {
    changeTileBackgroundColor(document.querySelector("#player--2"), "green");
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

    if (playerOneWon !== 1) {
      // Remove the tiles background color unless it is green
      removeAllTileBackgroundColor();
    }

    // Make the X's blue on the third turn if player one has not won
    if (turn % 3 === 0 && playerOneWon !== 1) {
      makeTilesBlue("X");
    }

    // Make it not player one's turn
    playerOne = false;

    // Enable the cpu's turn if player one has not won
    if (bot === true && playerOneWon !== 1) {
      botMove();
    }

    // Change the tile from empty to O or blue X to O
  } else if (
    !playerOne &&
    (tile.textContent === "" || tile.style.backgroundColor === "blue") &&
    bot === false
  ) {
    // Change background color of icon
    iconBackgroundColorChange(document.querySelector("#player--2"));

    // Change tile to an O
    changeTileContents(tile, "O");

    // Check for a winner
    playerTwoWon = winnerCheck();

    if (playerTwoWon !== 2) {
      // Remove the tiles background color unless it is green
      removeAllTileBackgroundColor();
    }

    // Color the O's blue every third action
    if (turn % 3 === 0 && playerTwoWon !== 2) {
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

    if (playerOneWon !== 1) {
      // Remove the tiles background color unless it is green
      removeAllTileBackgroundColor();
    }

    // Make the X's blue on the third turn if player one has not won
    if (turn % 2 === 0 && playerOneWon !== 1) {
      makeTilesBlue("X");
    }

    // Make it not player one's turn
    playerOne = false;

    // Run the CPU turn if player one has not won
    if (bot === true && playerOneWon !== 1) {
      botMove();
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

    if (playerOneWon !== 1) {
      // Remove the tiles background color
      removeAllTileBackgroundColor();
    }

    // Make the X's blue on the third turn if player one has not won
    if (turn % 2 === 0 && playerOneWon !== 1) {
      makeTilesBlue("X");
    }

    // Make it not player one's turn
    playerOne = false;

    // Run the CPU turn if player one has not won
    if (bot === true && playerOneWon !== 1) {
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
    iconBackgroundColorChange(document.querySelector("#player--2"));

    // Change the tile content to an O
    changeTileContents(tile, "O");

    // Check for a winner
    playerTwoWon = winnerCheck();

    if (playerTwoWon !== 2) {
      // Remove the tiles background color unless it is green
      removeAllTileBackgroundColor();
    }

    // Make the X's blue on the third turn if player one has not won
    if (turn % 2 === 0 && playerTwoWon !== 2) {
      makeTilesBlue("O");
    }

    // Send the turn back to player one
    playerOne = true;
  }
};

// Description changing function

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

// Audio functions

const muteAudio = function (audioObj) {
  console.log(audioObj);
  if (audioObj.style.backgroundColor !== "red") {
    audioObj.style.backgroundColor = "red";
    togglePlay();
  } else if (audioObj.style.backgroundColor === "red") {
    audioObj.style.backgroundColor = "white";
    audioObj.style.opacity = "0.877";
    togglePlay();
  }
};

const togglePlay = function () {
  let audio = document.querySelector("#pokemon");
  audio.volume = 0.05;
  audio.paused ? audio.play() : audio.pause();
};

// Set the volume to a lower amount

hammer.volume = 0.3;

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
      if (click === 0) {
        togglePlay();
        click++;
      }
    }
  });
});

// Clearing contents before game begins

clearAllTileContents();

playerOneImg.style.backgroundColor = "green";
