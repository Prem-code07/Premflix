import { useEffect, useMemo, useState } from "react";
import "./TicTacToe.css";

const EMPTY_BOARD = Array(9).fill(null);

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function findBestMove(board, mark) {
  // First, take a winning move; otherwise block the opponent.
  for (const [a, b, c] of WIN_LINES) {
    const line = [board[a], board[b], board[c]];
    if (line.filter((value) => value === mark).length === 2 &&
        line.filter((value) => value === null).length === 1) {
      return [a, b, c].find((index) => board[index] === null);
    }
  }

  const opponent = mark === "O" ? "X" : "O";
  for (const [a, b, c] of WIN_LINES) {
    const line = [board[a], board[b], board[c]];
    if (line.filter((value) => value === opponent).length === 2 &&
        line.filter((value) => value === null).length === 1) {
      return [a, b, c].find((index) => board[index] === null);
    }
  }

  if (board[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter((index) => board[index] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const available = board.map((value, index) => value === null ? index : -1).filter((index) => index !== -1);
  return available.length ? available[Math.floor(Math.random() * available.length)] : null;
}

export default function TicTacToe() {
  const [mode, setMode] = useState("computer");
  const [playerOne, setPlayerOne] = useState("Player 1");
  const [playerTwo, setPlayerTwo] = useState("Player 2");
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [turn, setTurn] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  const result = useMemo(() => getWinner(board), [board]);
  const isDraw = !result.winner && board.every(Boolean);
  const finished = Boolean(result.winner) || isDraw;

  const nameX = playerOne.trim() || "Player 1";
  const nameO = mode === "computer" ? "PREMFLIX AI" : (playerTwo.trim() || "Player 2");
  const currentName = turn === "X" ? nameX : nameO;

  function startGame() {
    setBoard(EMPTY_BOARD);
    setTurn("X");
    setScores({ X: 0, O: 0, draw: 0 });
    setRound(1);
    setGameStarted(true);
  }

  function nextRound() {
    setBoard(EMPTY_BOARD);
    setTurn("X");
    setRound((current) => current + 1);
  }

  useEffect(() => {
    if (!gameStarted || mode !== "computer" || turn !== "O" || finished) return;
    const timer = window.setTimeout(() => {
      const move = findBestMove(board, "O");
      if (move === null) return;
      setBoard((current) => {
        if (current[move] !== null) return current;
        const updated = [...current];
        updated[move] = "O";
        return updated;
      });
      setTurn("X");
    }, 450);
    return () => window.clearTimeout(timer);
  }, [board, finished, gameStarted, mode, turn]);

  useEffect(() => {
    if (!gameStarted || !finished) return;
    if (result.winner) {
      setScores((current) => ({ ...current, [result.winner]: current[result.winner] + 1 }));
    } else {
      setScores((current) => ({ ...current, draw: current.draw + 1 }));
    }
  }, [finished, gameStarted]); // A round is counted once when it first finishes.

  function playCell(index) {
    if (!gameStarted || finished || board[index] || (mode === "computer" && turn === "O")) return;
    const updated = [...board];
    updated[index] = turn;
    setBoard(updated);
    setTurn(turn === "X" ? "O" : "X");
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setBoard(EMPTY_BOARD);
    setTurn("X");
    setScores({ X: 0, O: 0, draw: 0 });
    setRound(1);
    setGameStarted(false);
  }

  let statusText = "Choose your move";
  if (!gameStarted) statusText = "Set your players and start a match";
  else if (result.winner) statusText = `${result.winner === "X" ? nameX : nameO} wins this round!`;
  else if (isDraw) statusText = "It's a draw!";
  else if (mode === "computer" && turn === "O") statusText = "PREMFLIX AI is thinking...";
  else statusText = `${currentName}'s turn (${turn})`;

  return (
    <main className="ttt-shell">
      <header className="ttt-heading">
        <p className="ttt-eyebrow">PREMFLIX GAME LAB</p>
        <h1>TIC-TAC-TOE<span>.</span></h1>
        <p className="ttt-subtitle">A classic battle. Make your move.</p>
      </header>

      <section className="ttt-mode-panel">
        <div className="ttt-mode-switch" aria-label="Game mode">
          <button className={mode === "computer" ? "active" : ""} onClick={() => changeMode("computer")}>
            1 VS COMPUTER
          </button>
          <button className={mode === "two" ? "active" : ""} onClick={() => changeMode("two")}>
            1 VS 1
          </button>
        </div>

        <div className="ttt-player-fields">
          <label>
            PLAYER X
            <input value={playerOne} onChange={(event) => setPlayerOne(event.target.value)} maxLength={18} placeholder="Enter player 1 name" />
          </label>
          {mode === "two" ? (
            <label>
              PLAYER O
              <input value={playerTwo} onChange={(event) => setPlayerTwo(event.target.value)} maxLength={18} placeholder="Enter player 2 name" />
            </label>
          ) : (
            <div className="ttt-ai-label">
              <span>OPPONENT</span>
              <strong>PREMFLIX AI</strong>
            </div>
          )}
        </div>
        {!gameStarted && <button className="ttt-primary-btn" onClick={startGame}>START GAME <span>→</span></button>}
      </section>

      {gameStarted && (
        <section className="ttt-match">
          <div className="ttt-scoreboard">
            <div className={turn === "X" && !finished ? "current" : ""}>
              <span className="ttt-mark x-mark">X</span>
              <small>{nameX}</small>
              <strong>{scores.X}</strong>
            </div>
            <div className="ttt-round">ROUND <strong>{round}</strong></div>
            <div className={turn === "O" && !finished ? "current" : ""}>
              <span className="ttt-mark o-mark">O</span>
              <small>{nameO}</small>
              <strong>{scores.O}</strong>
            </div>
          </div>

          <p className={`ttt-status ${finished ? "finished" : ""}`} aria-live="polite">{statusText}</p>

          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((value, index) => (
              <button
                key={index}
                className={`ttt-cell ${value === "X" ? "x-cell" : value === "O" ? "o-cell" : ""} ${result.line.includes(index) ? "winning-cell" : ""}`}
                onClick={() => playCell(index)}
                disabled={!gameStarted || finished || Boolean(value) || (mode === "computer" && turn === "O")}
                aria-label={`Cell ${index + 1}${value ? `, ${value}` : ", empty"}`}
                role="gridcell"
              >
                {value}
              </button>
            ))}
          </div>

          <div className="ttt-actions">
            {finished ? (
              <button className="ttt-primary-btn" onClick={nextRound}>PLAY NEXT ROUND <span>↻</span></button>
            ) : (
              <button className="ttt-secondary-btn" onClick={nextRound}>RESET ROUND</button>
            )}
            <button className="ttt-secondary-btn" onClick={() => setGameStarted(false)}>CHANGE PLAYERS</button>
          </div>
          <div className="ttt-draw-score">DRAWS <strong>{scores.draw}</strong></div>
        </section>
      )}
    </main>
  );
}
