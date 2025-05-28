const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
let board = Array(9).fill("");
let gameActive = true;
const human = "X";
const ai = "O";

let wins = 0,
  losses = 0,
  draws = 0;

function createBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, index) => {
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    cellEl.textContent = cell;
    cellEl.addEventListener("click", () => makeHumanMove(index));
    boardEl.appendChild(cellEl);
  });
}

function makeHumanMove(index) {
  if (!gameActive || board[index] !== "") return;
  board[index] = human;
  updateBoard();
  if (checkWin(human)) {
    statusEl.textContent = "You win!";
    gameActive = false;
    wins++;
    updateScoreboard();
    return;
  }
  if (isDraw()) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    draws++;
    updateScoreboard();
    return;
  }
  statusEl.textContent = "Computer's turn...";
  setTimeout(makeAIMove, 500);
}

function makeAIMove() {
  if (!gameActive) return;
  const bestMove = getBestMove(board, ai).index;
  board[bestMove] = ai;
  updateBoard();
  if (checkWin(ai)) {
    statusEl.textContent = "Computer wins!";
    gameActive = false;
    losses++;
    updateScoreboard();
  } else if (isDraw()) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    draws++;
    updateScoreboard();
  } else {
    statusEl.textContent = "Your turn (X)";
  }
}

function checkWin(player) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winCombos.some((combo) => combo.every((i) => board[i] === player));
}

function isDraw() {
  return board.every((cell) => cell !== "");
}

function updateBoard() {
  createBoard();
}

function updateScoreboard() {
  document.getElementById("wins").textContent = wins;
  document.getElementById("losses").textContent = losses;
  document.getElementById("draws").textContent = draws;
}

function resetGame() {
  board = Array(9).fill("");
  gameActive = true;
  statusEl.textContent = "Computer starts...";
  createBoard();
  setTimeout(makeAIMove, 500);
}

function getBestMove(newBoard, player) {
  const emptyIndexes = newBoard
    .map((val, i) => (val === "" ? i : null))
    .filter((i) => i !== null);

  if (checkWin(human)) return { score: -10 };
  if (checkWin(ai)) return { score: 10 };
  if (emptyIndexes.length === 0) return { score: 0 };

  let moves = [];

  for (let i = 0; i < emptyIndexes.length; i++) {
    const move = {};
    move.index = emptyIndexes[i];
    newBoard[move.index] = player;

    if (player === ai) {
      let result = getBestMove(newBoard, human);
      move.score = result.score;
    } else {
      let result = getBestMove(newBoard, ai);
      move.score = result.score;
    }

    newBoard[move.index] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

resetGame();
