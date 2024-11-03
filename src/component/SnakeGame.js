import React, { useState, useEffect, useCallback } from "react";
import "./SnakeGame.css";

const gridSize = 30;
const minSpeed = 50;
const maxSpeed = 500;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [food, setFood] = useState(generateFood());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    JSON.parse(localStorage.getItem("highScore")) || 0
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(200); // Default speed

  // Generate random food location
  function generateFood() {
    return {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  }

  // Handle key press for controlling snake direction
  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    },
    [direction]
  );

  // Update the snake's position
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check for wall or self-collision
        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= gridSize ||
          head.y >= gridSize ||
          newSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setIsGameOver(true);
          playSound("/sounds/game-over.mp3");
          return prevSnake;
        }

        // Add new head
        newSnake.unshift(head);

        // Check if snake ate the food
        if (head.x === food.x && head.y === food.y) {
          setScore((prevScore) => prevScore + 1);
          setFood(generateFood());
          playSound("eat"); // Play eat sound
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [direction, food, speed, isGameOver]);

  // Listen for key events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Play sound
  const playSound = (type) => {
    const sound = new Audio(
      type === "eat" ? "/sounds/eating.mp3" : "/sounds/game-over.mp3"
    );
    sound.play();
  };

  // Reset game function
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setFood(generateFood());
    setScore(0);
    setSpeed(200); // Reset to default speed
    setIsGameOver(false);
  };

  // Update high score if needed
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", JSON.stringify(score));
    }
  }, [score, highScore]);

  // Speed control handler
  const handleSpeedChange = (event) => {
    setSpeed(maxSpeed - event.target.value); // Invert speed for smooth control
  };

  return (
    <div className="container text-center mt-4">
      <h1 className="text-primary">Snake Game</h1>
      <p>
        Score: {score} | High Score: {highScore}
      </p>

      {/* Speed Control Slider */}
      <div className="speed-control mb-3">
        <label htmlFor="speedRange" className="form-label">
          Speed Control
        </label>
        <input
          type="range"
          className="form-range"
          min={minSpeed}
          max={maxSpeed}
          value={maxSpeed - speed}
          onChange={handleSpeedChange}
          id="speedRange"
        />
      </div>

      <div className="game-board">
        {Array.from({ length: gridSize }).map((_, row) => (
          <div key={row} className="game-row">
            {Array.from({ length: gridSize }).map((_, col) => {
              const isSnake = snake.some(
                (segment) => segment.x === col && segment.y === row
              );
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={col}
                  className={`game-cell ${isSnake ? "snake" : ""} ${
                    isFood ? "food" : ""
                  }`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      {isGameOver && (
        <div className="game-over alert alert-danger mt-4">
          <p>Game Over! Your score: {score}</p>
          <button className="btn btn-primary" onClick={resetGame}>
            Restart Game
          </button>
          <p>High Score: {highScore}</p>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
