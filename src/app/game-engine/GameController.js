import { GameRenderEngine } from './GameEngine'

export class GameController {
  gameObjectsList = []

  constructor({ gameCanvas }) {
    this.gameCanvas = gameCanvas
    this.renderEngine = new GameRenderEngine()
  }

  addGameObject({ gameObject }) {
    const isGameObjectAlreadyAdded = this.gameObjectsList.find(
      ({ name }) => name === gameObject.name
    )

    if (isGameObjectAlreadyAdded) {
      throw new Error(
        `Game object with name: ${gameObject.name} is} already added`
      )
    }

    this.gameObjectsList.push(gameObject)
  }

  startGame() {
    window.requestAnimationFrame(() => {
      this.renderEngine.render({
        gameCanvas: this.gameCanvas,
        gameObjectsList: this.gameObjectsList,
      })
    })
  }
}
