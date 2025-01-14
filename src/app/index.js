import { Game } from "./Game";

document.addEventListener("DOMContentLoaded", () => {
  console.log("aa");
  new Game(document.querySelector("#game-canvas")).init();
});
