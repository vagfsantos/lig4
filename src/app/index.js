import { Game } from "./Game";

document.addEventListener("DOMContentLoaded", () => {
  new Game(document.querySelector("#game-canvas")).init();
});
