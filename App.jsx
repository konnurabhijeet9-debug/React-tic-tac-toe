import { useState } from "react";
import { createGame, applyMove, undoGame } from "./gameLogic";

export default function App() {
  const [game, setGame] = useState(createGame);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const finished = game.status !== "InProgress";

  function handleMove(index) {
    if (finished) return;

    const nextGame = applyMove(game, index);

    // Ignore an invalid move
    if (nextGame === game) return;

    setGame(nextGame);

    // Update the score if the game has ended
    if (nextGame.status === "Won") {
      setScore((previous) => ({
        ...previous,
        [nextGame.winner]: previous[nextGame.winner] + 1,
      }));
    } else if (nextGame.status === "Draw") {
      setScore((previous) => ({
        ...previous,
        draws: previous.draws + 1,
      }));
    }
  }

  function handleReset() {
    setGame(createGame());
  }

  function handleUndo() {
    setGame((current) => undoGame(current));
  }

  function handleResetScore() {
    setScore({ X: 0, O: 0, draws: 0 });
  }

  let message = `Player ${game.currentPlayer}'s turn`;

  if (game.status === "Won") {
    message = `Player ${game.winner} wins!`;
  } else if (game.status === "Draw") {
    message = "It's a draw!";
  }

  return (
    <main className="app">
      <header className="page-header">
        <h1>Tic Tac Toe</h1>
        <p>A simple two-player game built with React</p>
      </header>

      <div className="layout">
        <section className="panel game-panel">
          <h2>Game</h2>

          <p className="status" role="status" aria-live="polite">
            {message}
          </p>

          <div className="board" role="group" aria-label="Tic Tac Toe board">
            {game.board.map((cell, index) => (
              <button
                key={index}
                type="button"
                className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ""} ${
                  game.winningCells.includes(index) ? "winning-cell" : ""
                }`}
                onClick={() => handleMove(index)}
                disabled={Boolean(cell) || finished}
                aria-label={`Row ${Math.floor(index / 3) + 1}, column ${
                  (index % 3) + 1
                }${cell ? `, ${cell}` : ", empty"}`}
              >
                {cell}
              </button>
            ))}
          </div>

          <div className="actions">
            <button type="button" onClick={handleReset}>
              Reset Game
            </button>

            <button
              type="button"
              className="secondary"
              onClick={handleUndo}
              disabled={game.history.length === 0 || finished}
            >
              Undo Last Move
            </button>
          </div>

          <p className="help-text">Players take turns. X starts first.</p>
        </section>

        <aside className="side-panel">
          <section className="panel">
            <h2>Scoreboard</h2>

            <div className="scores">
              <div className="score-item">
                <span>Player X wins</span>
                <strong>{score.X}</strong>
              </div>

              <div className="score-item">
                <span>Player O wins</span>
                <strong>{score.O}</strong>
              </div>

              <div className="score-item">
                <span>Draws</span>
                <strong>{score.draws}</strong>
              </div>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={handleResetScore}
            >
              Reset Scoreboard
            </button>
          </section>

          <section className="panel history-panel">
            <h2>Move History</h2>

            {game.history.length === 0 ? (
              <p className="empty-history">No moves yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Move</th>
                    <th>Player</th>
                    <th>Position</th>
                  </tr>
                </thead>

                <tbody>
                  {game.history.map((move) => (
                    <tr key={move.number}>
                      <td>{move.number}</td>
                      <td>Player {move.player}</td>
                      <td>
                        Row {move.row}, Column {move.column}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </aside>
      </div>

      <footer>React Tic Tac Toe · Frontend only</footer>
    </main>
  );
}
