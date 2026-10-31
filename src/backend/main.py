
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import sqlite3
import random
import uuid

app = FastAPI(title="PREMFLIX Game Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "games.db"

BOARD_SIZE = 20
CELL_COUNT = BOARD_SIZE * BOARD_SIZE
sessions = {}


def initialize_database():
    with sqlite3.connect(DATABASE) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS snake_scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


initialize_database()


class ScoreSubmission(BaseModel):
    player_name: str = Field(min_length=1, max_length=24)
    score: int = Field(ge=0, le=1000000)


class StartRequest(BaseModel):
    player_name: str = Field(default="Player", min_length=1, max_length=24)


class MoveRequest(BaseModel):
    game_id: str
    direction: str



def random_food(snake, occupied=None):
    occupied = set(occupied or [])
    occupied.update(snake)

    available = [
        (x, y)
        for x in range(BOARD_SIZE)
        for y in range(BOARD_SIZE)
        if (x, y) not in occupied
    ]
    return random.choice(available) if available else None




def public_state(game):
    return {
        "game_id": game["game_id"],
        "board_size": BOARD_SIZE,
        "snake": [{"x": x, "y": y} for x, y in game["snake"]],
        "food": (
            {"x": game["food"][0], "y": game["food"][1]}
            if game["food"] else None
        ),
        "bonus_food": (
            {
                "x": game["bonus_food"][0],
                "y": game["bonus_food"][1],
            }
            if game["bonus_food"] else None
        ),
        "foods_eaten": game["foods_eaten"],
        "score": game["score"],
        "status": game["status"],
        "direction": game["direction"],
    }



def store_score(game):
    if game["saved"]:
        return

    name = game["player_name"].strip()

    with sqlite3.connect(DATABASE, timeout=10) as connection:
        # Save the new game score
        connection.execute(
            """
            INSERT INTO snake_scores (player_name, score)
            VALUES (?, ?)
            """,
            (name, game["score"]),
        )

        # Keep only the top 5 scores for this username
        connection.execute(
            """
            DELETE FROM snake_scores
            WHERE player_name = ?
              AND id NOT IN (
                  SELECT id
                  FROM snake_scores
                  WHERE player_name = ?
                  ORDER BY score DESC, id ASC
                  LIMIT 5
              )
            """,
            (name, name),
        )

    game["saved"] = True


@app.get("/")
def home():
    return {"message": "PREMFLIX Game Lab API is running!"}


@app.post("/snake/start")
def start_game(request: StartRequest):
    player_name = request.player_name.strip() or "Player"

    snake = [(5, 10), (4, 10), (3, 10)]
    game_id = str(uuid.uuid4())

    
    game = {
        "game_id": game_id,
        "player_name": player_name,
        "snake": snake,
        "direction": "RIGHT",
        "food": random_food(snake),
        "bonus_food": None,
        "foods_eaten": 0,
        "score": 0,
        "status": "playing",
        "saved": False,
}


    sessions[game_id] = game
    return public_state(game)



@app.post("/snake/move")
def move_snake(request: MoveRequest):
    game = sessions.get(request.game_id)

    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    if game["status"] != "playing":
        return public_state(game)

    direction = request.direction.upper()

    directions = {
        "UP": (0, -1),
        "DOWN": (0, 1),
        "LEFT": (-1, 0),
        "RIGHT": (1, 0),
    }

    if direction not in directions:
        raise HTTPException(status_code=400, detail="Invalid direction")

    opposite = {
        "UP": "DOWN",
        "DOWN": "UP",
        "LEFT": "RIGHT",
        "RIGHT": "LEFT",
    }

    if direction != opposite[game["direction"]]:
        game["direction"] = direction

    dx, dy = directions[game["direction"]]
    head_x, head_y = game["snake"][0]
    new_head = (head_x + dx, head_y + dy)

    ate_food = new_head == game["food"]
    ate_bonus = new_head == game.get("bonus_food")

    # The tail moves away unless food is eaten.
    collision_body = (
        game["snake"]
        if ate_food or ate_bonus
        else game["snake"][:-1]
    )

    hit_wall = not (
        0 <= new_head[0] < BOARD_SIZE
        and 0 <= new_head[1] < BOARD_SIZE
    )
    hit_self = new_head in collision_body

    if hit_wall or hit_self:
        game["status"] = "game_over"
        store_score(game)
        return public_state(game)

    game["snake"].insert(0, new_head)

    if ate_food:
        game["score"] += 10
        game["foods_eaten"] = game.get("foods_eaten", 0) + 1

        game["food"] = random_food(
            game["snake"],
            occupied=(
                [game["bonus_food"]]
                if game.get("bonus_food") else None
            ),
        )

        # Spawn bonus food after every 5 regular foods.
        if game["foods_eaten"] % 5 == 0:
            game["bonus_food"] = random_food(
                game["snake"],
                occupied=(
                    [game["food"]]
                    if game["food"] else None
                ),
            )

    elif ate_bonus:
        game["score"] += 50
        game["bonus_food"] = None

    else:
        game["snake"].pop()

    if game["food"] is None:
        game["status"] = "won"
        store_score(game)

    return public_state(game)





@app.post("/snake/scores")
def save_score(submission: ScoreSubmission):
    name = submission.player_name.strip()

    if not name:
        raise HTTPException(
            status_code=422,
            detail="Player name is required",
        )

    with sqlite3.connect(DATABASE, timeout=10) as connection:

        # Save the new score
        connection.execute(
            """
            INSERT INTO snake_scores (player_name, score)
            VALUES (?, ?)
            """,
            (name, submission.score),
        )

        # Keep only the top 5 scores for this username
        connection.execute(
            """
            DELETE FROM snake_scores
            WHERE player_name = ?
              AND id NOT IN (
                  SELECT id
                  FROM snake_scores
                  WHERE player_name = ?
                  ORDER BY score DESC, id ASC
                  LIMIT 5
              )
            """,
            (name, name),
        )

    return {
        "message": "Score saved successfully",
        "player_name": name,
        "score": submission.score,
    }





@app.get("/snake/leaderboard")
def leaderboard():
    with sqlite3.connect(DATABASE) as connection:
        rows = connection.execute("""
            SELECT player_name, score
            FROM snake_scores
            ORDER BY
                player_name COLLATE NOCASE ASC,
                score DESC
        """).fetchall()

    return [
        {"player_name": name, "score": score}
        for name, score in rows
    ]

