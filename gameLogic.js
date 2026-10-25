const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Create a new game
export function createGame() {
  return {
    board: Array(9).fill(null),
    currentPlayer: "X",
    status: "InProgress",
    winner: null,
    winningCells: [],
    history: [],
  };
}

// Check whether a player won or the game is a draw
function getOutcome(board) {
  for (const line of winningLines) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        status: "Won",
        winner: board[a],
        winningCells: line,
      };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return {
      status: "Draw",
      winner: null,
      winningCells: [],
    };
  }

  return {
    status: "InProgress",
    winner: null,
    winningCells: [],
  };
}

// Make a move
export function applyMove(game, index) {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > 8 ||
    game.status !== "InProgress" ||
    game.board[index] !== null
  ) {
    return game;
  }

  const board = [...game.board];
  board[index] = game.currentPlayer;

  const outcome = getOutcome(board);

  const move = {
    number: game.history.length + 1,
    player: game.currentPlayer,
    index,
    row: Math.floor(index / 3) + 1,
    column: (index % 3) + 1,
  };

  return {
    board,
    history: [...game.history, move],
    currentPlayer:
      outcome.status === "InProgress"
        ? game.currentPlayer === "X"
          ? "O"
          : "X"
        : game.currentPlayer,
    ...outcome,
  };
}

// Undo the last move
export function undoGame(game) {
  if (game.history.length === 0 || game.status !== "InProgress") {
    return game;
  }

  const history = game.history.slice(0, -1);
  const board = Array(9).fill(null);

  history.forEach((move) => {
    board[move.index] = move.player;
  });

  return {
    board,
    history: history.map((move, index) => ({
      ...move,
      number: index + 1,
    })),
    currentPlayer: history.length % 2 === 0 ? "X" : "O",
    ...getOutcome(board),
  };
}
