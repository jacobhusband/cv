"use strict";

const tiles = document.querySelectorAll(".board-tile");
const playerOneImg = document.querySelector("#player-1-img");
const playerTwoImg = document.querySelector("#player-2-img");
const scorePlayerOne = document.querySelector("#player--1");
const scorePlayerTwo = document.querySelector("#player--2");

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
winIndex.push(win1, win2, win3, win4, win5, win6, win7, win8, win9, win10);

let playerOne = true;
let game = true;
let clickCountOne = 0;
let clickCountTwo = 0;

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
  playerOneImg.style.backgroundColor = "green";
  playerTwoImg.style.backgroundColor = "";
  let clickCountOne = 0;
  let clickCountTwo = 0;
  tiles.forEach((thing) => {
    thing.style.backgroundColor = "";
  });
};

const winnerCheck = function () {
  for (let x = 0; x < 10; x++) {
    let countOs = 0;
    let countXs = 0;
    for (let y = 0; y < 4; y++) {
      let index = winIndex[x][y];
      if (tiles[index].textContent === "X") {
        countXs++;
        console.log(countXs);
      } else if (tiles[index].textContent === "O") {
        countOs++;
      }
      if (countXs === 4) {
        console.log("Player 1 has won the game!");
        scorePlayerOne.textContent = Number(scorePlayerOne.textContent) + 1;
        newWinner();
      } else if (countOs === 4) {
        console.log("Player 2 has won the game!");
        scorePlayerTwo.textContent = Number(scorePlayerTwo.textContent) + 1;
        newWinner();
      }
    }
  }
};

document.querySelectorAll(".board-tile").forEach((item) => {
  item.addEventListener("click", (e) => {
    // Change the tile from empty to X or blue O to X
    if (
      playerOne &&
      (item.textContent === "" || item.style.backgroundColor == "blue")
    ) {
      playerOneImg.style.backgroundColor = "";
      playerTwoImg.style.backgroundColor = "green";
      clickCountOne++;
      item.textContent = "X";
      playerOne = false;

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

      // Change the tile from empty to O or blue X to O
    } else if (
      !playerOne &&
      (item.textContent === "" || item.style.backgroundColor === "blue")
    ) {
      playerTwoImg.style.backgroundColor = "";
      playerOneImg.style.backgroundColor = "green";
      clickCountTwo++;
      item.textContent = "O";
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
    // console.log(`Click Count One: ${clickCountOne}`);
    // console.log(`Click Count Two: ${clickCountTwo}`);

    // Need to check if someone won
    winnerCheck();
  });
});
