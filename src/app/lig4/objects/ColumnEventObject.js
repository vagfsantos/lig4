import { GAME_OBJECT_TYPES, GameObject } from '@game-engine/GameObject'

export class ColumnEventObject extends GameObject {
  debugMode = false
  type = GAME_OBJECT_TYPES.STATIC

  render({ gameCanvas }) {
    if (this.debugMode) {
      const ctx = gameCanvas.getCanvasContext()
      ctx.beginPath()
      ctx.strokeStyle = 'red'
      ctx.strokeRect(this.x, this.y, this.width, this.height)
      ctx.stroke()
    }
  }
}
