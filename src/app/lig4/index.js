import { Lig4Controller } from '@lig4/game/Lig4Controller'

document.addEventListener('DOMContentLoaded', () => {
  const controller = new Lig4Controller()
  controller.init()

  document
    .querySelector('#canvas-placeholder')
    .appendChild(controller.canvas.getCanvas())
})
