import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SnakeGame from "./component/SnakeGame";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SnakeGame />
  </React.StrictMode>
);
