
import { useCallback, useEffect, useRef, useState } from "react";
import "./SnakeGame.css";

const API = "https://premflix.onrender.com";

export default function SnakeGame() {
  const [playerName, setPlayerName] = useState("Prem");
  const [game, setGame] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const directionRef = useRef("RIGHT");
  const busyRef = useRef(false);
  const touchStartRef = useRef(null);

  // Change direction using keyboard, buttons or swipe.
  const changeDirection = useCallback((direction) => {
    const opposite = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (direction !== opposite[directionRef.current]) {
      directionRef.current = direction;
    }
  }, []);

  const startGame = async () => {
    setError("");
    setBusy(true);

    try {
      const response = await fetch(`${API}/snake/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_name: playerName.trim() || "Player",
        }),
      });

      if (!response.ok) throw new Error("Could not start the game.");

      const data = await response.json();

      directionRef.current = "RIGHT";
      busyRef.current = false;
      setGame(data);
    } catch {
      setError("Cannot connect to Python. Please try again.");
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
      setError("Movement failed. Check your backend connection.");
    } finally {
      busyRef.current = false;
    }
  }, [game]);

  // Automatic snake movement.
  useEffect(() => {
    if (!game || game.status !== "playing") return;

    const timer = setInterval(() => {
      move(directionRef.current);
    }, 180);

    return () => clearInterval(timer);
  }, [game?.game_id, game?.status, move]);

  // Desktop keyboard controls.
  useEffect(() => {
    const handleKey = (event) => {
      const keys = {
        ArrowUp: "UP",
        w: "UP",
        W: "UP",
        ArrowDown: "DOWN",
        s: "DOWN",
        S: "DOWN",
        ArrowLeft: "LEFT",
        a: "LEFT",
        A: "LEFT",
        ArrowRight: "RIGHT",
        d: "RIGHT",
        D: "RIGHT",
      };

      const direction = keys[event.key];
      if (!direction) return;

      if (game?.status === "playing") {
        event.preventDefault();
        changeDirection(direction);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [changeDirection, game?.status]);

  // Mobile swipe controls.
  const handleTouchStart = (event) => {
    const touch = event.touches?.[0] || event;
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event) => {
    if (!touchStartRef.current || game?.status !== "playing") return;

    const touch = event.changedTouches?.[0] || event;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    touchStartRef.current = null;

    const threshold = 25;

    if (
      Math.abs(deltaX) < threshold &&
      Math.abs(deltaY) < threshold
    ) return;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      changeDirection(deltaX > 0 ? "RIGHT" : "LEFT");
    } else {
      changeDirection(deltaY > 0 ? "DOWN" : "UP");
    }
  };

  // Build the 20 x 20 game board.
  const cells = [];

  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      const isHead =
        game?.snake?.[0]?.x === x &&
        game?.snake?.[0]?.y === y;

      const isSnake = game?.snake?.some(
        (part) => part.x === x && part.y === y
      );

      const isFood =
        game?.food?.x === x &&
        game?.food?.y === y;

      const isBonusFood =
        game?.bonus_food?.x === x &&
        game?.bonus_food?.y === y;

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
          <div
            className="snake-board"
            aria-label="Snake game board. Swipe to change direction."
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {cells}
          </div>

          <p className="snake-status">
            {game.status === "playing"
              ? "Swipe or use the direction buttons to move"
              : game.status === "won"
                ? "YOU WIN!"
                : "GAME OVER"}
          </p>

          {game.status === "playing" && (
            <div className="snake-mobile-controls">
              <button
                type="button"
                className="snake-control up"
                aria-label="Move up"
                onClick={() => changeDirection("UP")}
              >
                ▲
              </button>

              <div className="snake-control-row">
                <button
                  type="button"
                  className="snake-control"
                  aria-label="Move left"
                  onClick={() => changeDirection("LEFT")}
                >
                  ◀
                </button>

                <button
                  type="button"
                  className="snake-control"
                  aria-label="Move down"
                  onClick={() => changeDirection("DOWN")}
                >
                  ▼
                </button>

                <button
                  type="button"
                  className="snake-control"
                  aria-label="Move right"
                  onClick={() => changeDirection("RIGHT")}
                >
                  ▶
                </button>
              </div>
            </div>
          )}

          {game.status !== "playing" && (
            <button onClick={startGame} disabled={busy}>
              PLAY AGAIN
            </button>
          )}

          <button
            className="snake-secondary"
            onClick={() => {
              setGame(null);
              setError("");
              busyRef.current = false;
            }}
          >
            BACK TO START
          </button>
        </>
      )}

      {error && <p className="snake-error">{error}</p>}
    </section>
  );
}
