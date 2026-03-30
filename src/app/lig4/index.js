import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'

import { BOARD_SETTINGS } from '@lig4/constants/gameSettings'
import { Lig4Controller } from '@lig4/game/Lig4Controller'
import { SpotObject } from '@lig4/objects/SpotObject'

document.addEventListener('DOMContentLoaded', () => {
  const controller = new Lig4Controller()
  controller.init()

  document
    .querySelector('#canvas-placeholder')
    .appendChild(controller.canvas.getCanvas())
})
