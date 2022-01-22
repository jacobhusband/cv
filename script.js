"use strict";

// TODO: Create a CPU to play against that checks all the potential win scenarios and blocks the highest chance of winning and at the same time picks a location that increases its win chance. Then allow the user to select PvP or PvCPU and also let the user select if they want to let the CPU begin the game as X or if they want the CPU to be O.

// Add a button to turn on the CPU then create an if statement that checks if that option is turned on or not.

const tiles = document.querySelectorAll(".board-tile");
const playerOneImg = document.querySelector("#player-1-img");
const playerTwoImg = document.querySelector("#player-2-img");
const scorePlayerOne = document.querySelector("#player--1");
const scorePlayerTwo = document.querySelector("#player--2");
const cpu = document.querySelector("#cpu");
const cpuScore = document.querySelector("#cpu-score");
const tieScore = document.querySelector("#tie-score")

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

let tileContainer = [];
let winIndex = [];

let offensiveDict = {};
let defensiveDict = {};

winIndex.push(win1, win2, win3, win4, win5, win6, win7, win8, win9, win10);

let playerOne = true;
let bot = false;
let newGame = false;
let skipTheRest = false;
let clickCountOne = 0;
let clickCountTwo = 0;
let cpuCount = 0;
let randomNumber = 0;
let square;

playerOneImg.style.backgroundColor = "green";

tiles.forEach((thing) => {
  thing.textContent = "";
});

// console.log(`Click Count One: ${clickCountOne}`);
// console.log(`Click Count Two: ${clickCountTwo}`);

const newWinner = function () {
  tiles.forEach((thing) => {
    thing.textContent = "";
  });

  playerOne = true;
  newGame = true;
  playerOneImg.style.backgroundColor = "green";
  playerTwoImg.style.backgroundColor = "";
  clickCountOne = 0;
  clickCountTwo = 0;
  cpuCount = 0;
  randomNumber = 0;
  square = "";

  tiles.forEach((thing) => {
    thing.style.backgroundColor = "";
  });
};

const winnerCheck = function () {
  let count = 0;
  for (let x = 0; x < 10; x++) {
    let countOs = 0;
    let countXs = 0;
    for (let y = 0; y < 4; y++) {
      let index = winIndex[x][y];
      if (tiles[index].textContent === "X") {
        countXs++;
      } else if (tiles[index].textContent === "O") {
        countOs++;
      }
      if (countXs === 4) {
        console.log("Player 1 has won the game!");
        scorePlayerOne.textContent = Number(scorePlayerOne.textContent) + 1;
        newWinner();
      } else if (countOs === 4 && bot === false) {
        console.log("Player 2 has won the game!");
        scorePlayerTwo.textContent = Number(scorePlayerTwo.textContent) + 1;
        newWinner();
      } else if (countOs === 4 && bot === true) {
        console.log("CPU has won the game!");
        cpuScore.textContent = Number(cpuScore.textContent) + 1;
        newWinner();
      }
    }
  }
  tiles.forEach((thing) => {
    if (thing.textContent === "X" || thing.textContent === "O") {
      count++;
    }
    if (count === 16) {
      console.log(`Tie Game!`);
      tieScore.textContent = Number(tieScore.textContent) + 1;
      newWinner();
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
        skipTheRest = true;
        let clickCount = 0;
        winIndex[x].forEach((ind) => {
          if (
            tiles[ind].textContent === "X" &&
            tiles[ind].style.backgroundColor === "blue" &&
            clickCount === 0
          ) {
            tiles[ind].textContent = "O";
            console.log(
              `There were three X's on the steal turn, so that bot stole the X at index: ${ind}`
            );
            clickCount++;
          }
        });

        winIndex[x].forEach((ind) => {
          if (tiles[ind].textContent === "" && clickCount === 0) {
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
        skipTheRest = true;
        let clickCount = 0;
        winIndex[x].forEach((ind) => {
          if (tiles[ind].textContent === "" && clickCount === 0) {
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

const botCheck = function () {
  // If the bot will not lose and has 2 O's in a win condition with the third position open, take it

  let possibleMoveIndeces = [];
  let offensiveMove = [];
  let defensiveMove = [];
  let nextMoveIndex;
  let countXs = 0;
  let countOs = 0;

  for (let x = 0; x < 10; x++) {
    countXs = 0;
    countOs = 0;
    for (let y = 0; y < 4; y++) {
      let index = winIndex[x][y];
      if (tiles[index].textContent === "X") {
        countXs++;
      } else if (tiles[index].textContent === "O") {
        countOs++;
      }
    }
    offensiveMove.push(countOs);
    defensiveMove.push(countXs);
  }

  // Check if the bot has a way to win or is about to lose
  if (!skipTheRest) {
    winConCheck();
    loseConCheck();
  }

  // If the bot cannot win and cannot lose make a player that is defensive
  if (!skipTheRest) {
    for (const [index, element] of defensiveMove.entries()) {
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
    nextMoveIndex = botFindNextMove(possibleMoveIndeces);
    tiles[nextMoveIndex].textContent = "O";
    console.log(
      `Here is the index that the bot wanted to choose: ${nextMoveIndex}`
    );
    winnerCheck();
  }
  if (cpuCount % 3 === 0) {
    tiles.forEach((thing) => {
      thing.style.backgroundColor = "";
    });
    tiles.forEach((thing) => {
      if (thing.textContent === "O") thing.style.backgroundColor = "blue";
    });
  }
};

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
      winnerCheck();
      if (!newGame) {
        playerOne = false;
        skipTheRest = false;

        // Turn off blue for O's
        tiles.forEach((thing) => {
          thing.style.backgroundColor = "";
        });

        // Color the X's blue every third action
        if (clickCountOne % 3 === 0) {
          tiles.forEach((thing) => {
            if (thing.textContent === "X") thing.style.backgroundColor = "blue";
          });
        }
        if (bot === true) {
          playerOne = true;
          playerOneImg.style.backgroundColor = "green";
          cpuCount++;
          console.log(`The turn for the CPU is: ${cpuCount}`);
          if (cpuCount === 1) {
            for (let x = 0; x < cpuTiles1.length; x++) {
              square = tiles[cpuTiles1[x]];
              if (square.textContent === "") {
                tileContainer.push(square);
              }
            }
            randomNumber = Math.trunc(Math.random() * tileContainer.length);
            tileContainer[randomNumber].textContent = "O";
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
      if (!newGame) {
        playerOne = true;

        // Turn off blue for X's
        tiles.forEach((thing) => {
          thing.style.backgroundColor = "";
        });

        // Color the O's blue every third action
        if (clickCountTwo % 3 === 0) {
          tiles.forEach((thing) => {
            if (thing.textContent === "O") thing.style.backgroundColor = "blue";
          });
        }
      }
    }
    // Need to check if someone won
    if (!newGame) {
      winnerCheck();
    }
    newGame = false;
  });
  // Add CPU logic
});
