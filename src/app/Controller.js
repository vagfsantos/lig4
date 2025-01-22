import { PLAYERS } from "./constants";

export class Controller {
  constructor({ mouseAction, board }) {
    this.mouseAction = mouseAction;
    this.board = board;
    this.UI = {
      userScoreElement: document.querySelector("#user-score-points"),
      machineScoreElement: document.querySelector("#machine-score-points"),
      userScoreWrapper: document.querySelector("#user-score-wrapper"),
      machineScoreWrapper: document.querySelector("#machine-score-wrapper"),
      resultModal: document.querySelector("#match-end-modal"),
      playAgainBtn: document.querySelector("#match-end-play-again-btn"),
      matchEndResult: document.querySelector("#match-end-result"),
    };
  }

  watchPlayAgain() {
    this.UI.playAgainBtn.addEventListener("click", () => {
      this.board.newGameMatch();
      this.UI.resultModal.classList.remove("is-match-ended");
    });
  }

  watchMouseEvents() {
    this.mouseAction.watch();
    this.mouseAction.onMouseMove((...args) => this.onMouseMove(...args));
    this.mouseAction.onMouseOut((...args) => this.onMouseOut(...args));
    this.mouseAction.onMouseClick((...args) => this.onMousClick(...args));
  }

  onMouseMove({ positionX, positionY }) {
    this.board.setColumnActive({ positionX });
  }

  onMouseOut() {
    this.board.setAllColumnsInactive();
  }

  onMousClick({ positionX, positionY }) {
    if (this.board.getPlayTurn() === PLAYERS.USER) {
      this.board.play({
        whichPlayer: PLAYERS.USER,
        columnIndex: this.board.getColumnIndexByPositionX(positionX),
      });
    }
  }

  watchMatchEnd() {
    this.board.onMatchEnd(({ result }) => {
      console.log({ result });
      let userScore = +this.UI.userScoreElement.textContent;
      let machineScore = +this.UI.machineScoreElement.textContent;

      if (result === PLAYERS.USER) {
        userScore++;
        this.UI.matchEndResult.textContent = "You won!";
      }

      if (result === PLAYERS.MACHINE) {
        machineScore++;
        this.UI.matchEndResult.textContent = "Machine won!";
      }

      if (result !== PLAYERS.USER && result !== PLAYERS.MACHINE) {
        this.UI.matchEndResult.textContent = "Draw";
      }

      this.UI.userScoreElement.textContent = userScore;
      this.UI.machineScoreElement.textContent = machineScore;
      this.UI.resultModal.classList.add("is-match-ended");
    });
  }

  watchPlayTurn() {
    this.board.onPlayTurnChange(({ currentTurn }) => {
      if (currentTurn === PLAYERS.USER) {
        this.UI.userScoreWrapper.classList.add("is-playing");
        this.UI.machineScoreWrapper.classList.remove("is-playing");

        return;
      }

      if (currentTurn === PLAYERS.MACHINE) {
        this.UI.machineScoreWrapper.classList.add("is-playing");
        this.UI.userScoreWrapper.classList.remove("is-playing");

        return;
      }

      this.UI.machineScoreWrapper.classList.remove("is-playing");
      this.UI.userScoreWrapper.classList.remove("is-playing");
    });
  }
}
