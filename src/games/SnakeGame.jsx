
import { useCallback, useEffect, useRef, useState } from "react";
import "./SnakeGame.css";

const API = "http://127.0.0.1:8000";

export default function SnakeGame() {
  const [playerName, setPlayerName] = useState("Prem");
  const [game, setGame] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const directionRef = useRef("RIGHT");
  const busyRef = useRef(false);

  const startGame = async () => {
    setError("");
    setBusy(true);
    try {
      const response = await fetch(`${API}/snake/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_name: playerName.trim() || "Player" }),
      });
      if (!response.ok) throw new Error("Could not start the game.");
      const data = await response.json();
      directionRef.current = "RIGHT";
      setGame(data);
    } catch {
      setError("Cannot connect to Python. Make sure FastAPI is running.");
    } finally {
      setBusy(false);
    }
  };

  const move = useCallback(async (direction) => {
    if (!game || game.status !== "playing" || busyRef.current) return;
    busyRef.current = true;
    try {
      const response = await fetch(`${API}/snake/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: game.game_id,
          direction,
        }),
      });
      if (!response.ok) throw new Error("Movement failed.");
      setGame(await response.json());
    } catch {
      setError("Movement failed. Check your Python backend.");
    } finally {
      busyRef.current = false;
    }
  }, [game]);

  useEffect(() => {
    if (!game || game.status !== "playing") return;
    const timer = setInterval(() => move(directionRef.current), 180);
    return () => clearInterval(timer);
  }, [game?.game_id, game?.status, move]);

  useEffect(() => {
    const handleKey = (event) => {
      const keys = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
      };
      const direction = keys[event.key];
      if (!direction) return;
      event.preventDefault();
      const opposite = {
        UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
      };
      if (direction !== opposite[directionRef.current]) {
        directionRef.current = direction;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const cells = [];
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      const isHead = game?.snake?.[0]?.x === x && game?.snake?.[0]?.y === y;
      const isSnake = game?.snake?.some((part) => part.x === x && part.y === y);
      const isFood = game?.food?.x === x && game?.food?.y === y;
      const isBonusFood = game?.bonus_food?.x === x && game?.bonus_food?.y === y;
      cells.push(
        <div
          key={`${x}-${y}`}
          className={[
            "snake-cell",
            isSnake ? "snake-body" : "",
            isHead ? "snake-head" : "",
            isFood ? "snake-food" : "",
            isBonusFood ? "snake-bonus-food" : "",
          ].filter(Boolean).join(" ")}
        />
      );
    }
  }

  return (
    <section className="snake-game">
      <header className="snake-header">
        <div>
          <p className="snake-eyebrow">PREMFLIX GAME LAB</p>
          <h2>Python Snake</h2>
        </div>
        <div className="snake-score">
          <span>SCORE</span>
          <strong>{game?.score ?? 0}</strong>
        </div>
      </header>

      {!game && (
        <div className="snake-start">
          <label htmlFor="snake-player">Player name</label>
          <input
            id="snake-player"
            maxLength={24}
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
          <button onClick={startGame} disabled={busy}>
            {busy ? "Starting..." : "START GAME"}
          </button>
        </div>
      )}

      {game && (
        <>
          <div className="snake-board" role="img" aria-label="Snake game board">
            {cells}
          </div>
          <p className="snake-status">
            {game.status === "playing"
              ? "Use arrow keys or WASD to move"
              : game.status === "won"
                ? "YOU WIN!"
                : "GAME OVER"}
          </p>
          {game.status !== "playing" && (
            <button onClick={startGame} disabled={busy}>PLAY AGAIN</button>
          )}
          <button className="snake-secondary" onClick={() => setGame(null)}>
            BACK TO START
          </button>
        </>
      )}

      {error && <p className="snake-error">{error}</p>}
    </section>
  );
}




