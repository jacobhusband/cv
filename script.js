"use strict";

// TODO: Create a CPU to play against that checks all the potential win scenarios and blocks the highest chance of winning and at the same time picks a location that increases its win chance. Then allow the user to select PvP or PvCPU and also let the user select if they want to let the CPU begin the game as X or if they want the CPU to be O.

// Add a button to turn on the CPU then create an if statement that checks if that option is turned on or not.

const tiles = document.querySelectorAll(".board-tile");
const description = document.querySelector(".description");
const playerOneImg = document.querySelector("#player-1-img");
const playerTwoImg = document.querySelector("#player-2-img");
const scorePlayerOne = document.querySelector("#player--1");
const scorePlayerTwo = document.querySelector("#player--2");
const cpu = document.querySelector("#cpu");
const cpuScore = document.querySelector("#cpu-score");
const tieScore = document.querySelector("#tie-score");
const winnerText = document.querySelector("#text");
const overlay = document.querySelector("#overlay");
const playAgain = document.querySelector("#rematch");

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
let clickCountOne = 0;
let clickCountTwo = 0;
let cpuCount = 0;
let randomNumber = 0;
let square;

playerOneImg.style.backgroundColor = "green";

tiles.forEach((thing) => {
  thing.textContent = "";
});

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

const newWinner = function () {
  waitForNewGame = false;
  playAgain.style.display = "none";
  noTileContent();
  removeTileBackgroundColor();
  playerOne = true;
  skipTheRest = false;
  playerOneImg.style.backgroundColor = "green";
  playerTwoImg.style.backgroundColor = "";
  clickCountOne = 0;
  clickCountTwo = 0;
  cpuCount = 0;
  randomNumber = 0;
  square = "";
};

const noTileContent = function () {
  tiles.forEach((thing) => {
    thing.textContent = "";
  });
}

const removeTileBackgroundColor = function () {
  tiles.forEach((thing) => {
    thing.style.backgroundColor = "";
  });
}

const colorWinningTilesRed = function (index) {
  winIndex[index].forEach((ind) => {
    tiles[ind].style.backgroundColor = "red";
  })
}

const makeOsBlue = function () {
  tiles.forEach((thing) => {
    if (thing.textContent === "O") thing.style.backgroundColor = "blue";
  });
}

const makeXsBlue = function () {
  tiles.forEach((thing) => {
    if (thing.textContent === "X") thing.style.backgroundColor = "blue";
  });
}

const winnerDisplay = function (winnerMessage, scoreTag, index) {
  waitForNewGame = true;
  console.log(winnerMessage);
  scoreTag.textContent = Number(scoreTag.textContent) + 1;
  winnerText.textContent = winnerMessage;
  on();
  playAgain.style.display = "block";
  removeTileBackgroundColor();
  if (index) {
  colorWinningTilesRed(index);
  }
}

const winnerCheck = function () {
  let count = 0;
  let v;
  for (let x = 0; x < 10; x++) {
    let countOs = 0;
    let countXs = 0;
    v = x;
    for (let y = 0; y < 4; y++) {
      let index = winIndex[x][y];
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
      } else if (countOs === 4 && bot === true) {
        let msg = "CPU has won the game!";
        winnerDisplay(msg, cpuScore, v);
      }
    }
  }
  tiles.forEach((thing) => {
    if (thing.textContent === "X" || thing.textContent === "O") {
      count++;
    }
    if (count === 16) {
      let msg = "Tie Game!";
      winnerDisplay(msg, tieScore, v);
    }
  });
};

const botFindNextMove = function (moveCount) {
  let mf = 1;
  let m = 0;
  let item;
  for (let i = 0; i < moveCount.length; i++) {
    for (let j = i; j < moveCount.length; j++) {
      if (moveCount[i] == moveCount[j]) m++;
      if (mf < m) {
        mf = m;
        item = moveCount[i];
      }
    }
    m = 0;
  }
  return item;
};

const loseConCheck = function () {
  let countXs = 0;

  for (let x = 0; x < 10; x++) {
    if (!skipTheRest) {
      countXs = 0;
      for (let y = 0; y < 4; y++) {
        let index = winIndex[x][y];
        if (tiles[index].textContent === "X") {
          countXs++;
        }
      }
      if (countXs === 3) {
        let clickCount = 0;
        winIndex[x].forEach((ind) => {
          if (
            tiles[ind].textContent === "X" &&
            tiles[ind].style.backgroundColor === "blue" &&
            clickCount === 0
          ) {
            skipTheRest = true;
            tiles[ind].textContent = "O";
            console.log(
              `There were three X's on the steal turn, so that bot stole the X at index: ${ind}`
            );
            clickCount++;
          }
        });

        winIndex[x].forEach((ind) => {
          if (tiles[ind].textContent === "" && clickCount === 0) {
            skipTheRest = true;
            tiles[ind].textContent = "O";
            console.log(
              `Found 3 X's and stopped a win by placing an O at index: ${ind}`
            );
            clickCount++;
          }
        });

        winIndex[x].forEach((ind) => {
          if (tiles[ind].textContent === "O" && clickCount === 0) {
            skipTheRest = false;
            console.log(
              `Found 3 X's in a row, but an O is already blocking the win.`
            );
          }
        });
      }
    }
  }
};

const winConCheck = function () {
  let countOs = 0;

  for (let x = 0; x < 10; x++) {
    if (!skipTheRest) {
      countOs = 0;
      for (let y = 0; y < 4; y++) {
        let index = winIndex[x][y];
        if (tiles[index].textContent === "O") {
          countOs++;
        }
      }
      if (countOs === 3) {
        let clickCount = 0;
        winIndex[x].forEach((ind) => {
          if (tiles[ind].textContent === "" && clickCount === 0) {
            skipTheRest = true;
            tiles[ind].textContent = "O";
            clickCount++;
            console.log(
              `The CPU saw the fourth spot empty and got four O's in a row by clicking index: ${ind}`
            );
          }
        });

        winIndex[x].forEach((ind) => {
          if (
            tiles[ind].textContent === "X" &&
            tiles[ind].style.backgroundColor === "blue" &&
            clickCount === 0
          ) {
            skipTheRest = true;
            tiles[ind].textContent = "O";
            clickCount++;
            console.log(
              `The CPU saw the fourth spot taken by an X, but it was a steal turn, so the CPU stole the X, getting four O's in a row and winning. Click index: ${ind}`
            );
          }
        });

        winIndex[x].forEach((ind) => {
          if (tiles[ind].textContent === "X" && clickCount === 0) {
            skipTheRest = false;
          }
        });
      }
    }
  }
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
          }
        }
      }
    }
  }
  return possibleMoveIndeces;
}

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
}

const botAgressiveMove = function () {
  let countOs;
  let countOpenTiles;
  let index;

  for (let x = 0; x < 10; x++) {
    if (!skipTheRest) {
    countOs = 0;
    countOpenTiles = 0;

    for (let y = 0; y < 4; y++) {
      index = winIndex[x][y];
      if (tiles[index].textContent === "O") {
        countOs++;
      } else if ((tiles[index].textContent === "X" && tiles[index].style.backgroundColor === "blue") || tiles[index].textContent === "") {
        countOpenTiles++;
      }
    }

    if (countOpenTiles >= 1 && countOs === 2) {
      let clickCount = 0;
      for (let y = 0; y < 4; y++) {
        let index = winIndex[x][y];
        if (tiles[index].textContent === "X" && tiles[index].style.backgroundColor === "blue" && clickCount === 0) {
          tiles[index].textContent = "O";
          skipTheRest = true;
          clickCount++;
        } else if (tiles[index].textContent === "" && clickCount === 0) {
          tiles[index].textContent = "O";
          skipTheRest = true;
          clickCount++;
        }
      }
    }
  }
  }
}

const botCheck = function () {
  // If the bot will not lose and has 2 O's in a win condition with the third position open, take it

  let possibleMoveIndeces = [];
  let defensiveMoves = [];
  let nextMoveIndex;

  // Check if the bot has a way to win or is about to lose
  if (!skipTheRest) {
    winConCheck();
  }
  if (!skipTheRest) {
    loseConCheck();
  }

  // If the bot is not about to lose or win, check if there are two Os with either two empty spots next to it or an empty spot and a stealable X
  // Add more console logs to the botAgressiveMove to see why it is not triggering
  if (!skipTheRest) {
    botAgressiveMove();
    console.log(`Skip the rest: ${skipTheRest}`);
  }

  // If the bot cannot win and cannot lose make a player that is defensive
  if (!skipTheRest) {
    defensiveMoves = countXsOrOs("X");

    // Mess with this to see if we can get the bot to play more aggressive when in the early stages of the game or not in danger of losing
    possibleMoveIndeces = populateArrayWithPossibleMoves(defensiveMoves);
    nextMoveIndex = botFindNextMove(possibleMoveIndeces);
    tiles[nextMoveIndex].textContent = "O";
    console.log(
      `Here is the index that the bot wanted to choose: ${nextMoveIndex}`
    );
    winnerCheck();
  }
  if (cpuCount % 3 === 0) {
    removeTileBackgroundColor();
    makeOsBlue();
  }
};

const cpuRoundOneMove = function () {
  let tileContainer = []
  for (let x = 0; x < cpuTiles1.length; x++) {
    square = tiles[cpuTiles1[x]];
    if (square.textContent === "") {
      tileContainer.push(square);
    }
  }
  randomNumber = Math.trunc(Math.random() * tileContainer.length);
  tileContainer[randomNumber].textContent = "O";
}

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

document.querySelectorAll(".board-tile").forEach((item) => {
  item.addEventListener("click", (e) => {
    if (!waitForNewGame){
    let val = 0;
    // Change the tile from empty to X or blue O to X
    if (
      playerOne &&
      (item.textContent === "" || item.style.backgroundColor == "blue")
    ) {
      playerOneImg.style.backgroundColor = "";
      if (bot === false) {
        playerTwoImg.style.backgroundColor = "green";
      }
      
      clickCountOne++;
      item.textContent = "X";
      val = winnerCheck();
      
      playerOne = false;

      if (!val) {
        skipTheRest = false;
        

        removeTileBackgroundColor();

        if (clickCountOne % 3 === 0) {
          makeXsBlue();
        }
        
        if (bot === true) {
          playerOne = true;
          playerOneImg.style.backgroundColor = "green";
          cpuCount++;
          console.log(`The turn for the CPU is: ${cpuCount}`);
          if (cpuCount === 1) {
            cpuRoundOneMove();
          } else {
            botCheck();
          }
        }
      }
        

        // Change the tile from empty to O or blue X to O
      } else if (
        !playerOne &&
        (item.textContent === "" || item.style.backgroundColor === "blue") &&
        bot === false
      ) {
          playerTwoImg.style.backgroundColor = "";
          playerOneImg.style.backgroundColor = "green";
          clickCountTwo++;
          item.textContent = "O";
          winnerCheck();
            playerOne = true;

          // Turn off blue for X's
          removeTileBackgroundColor();

          // Color the O's blue every third action
          if (clickCountTwo % 3 === 0) {
            makeOsBlue();
          }
        }
    // Need to check if someone won
    if (!val) {
    winnerCheck();
    }
  }
  });
  // Add CPU logic
});
