import { GAME_OBJECT_TYPES, GameObject } from '@game-engine/GameObject'
import {
  BOARD_SETTINGS,
  PLAYERS_ID,
  SPOT_BORDER_COLORS_BY_STATUS,
  SPOT_COLORS_BY_STATUS,
  SPOT_STATUSES,
} from '@lig4/constants/gameSettings'

export class SpotObject extends GameObject {
  type = GAME_OBJECT_TYPES.STATIC

  state = {
    status: 'default',
    owner: null,
  }

  constructor({ name }) {
    super({ name })

    this.diameterSize =
      BOARD_SETTINGS.SPOT_RADIUS * 2 + BOARD_SETTINGS.SPOT_BORDER_WIDTH * 2
    this.width = this.diameterSize
    this.height = this.diameterSize
  }

  render({ gameCanvas }) {
    const ctx = gameCanvas.getCanvasContext()
    const xCoordinate = this.x + this.diameterSize / 2
    const yCoordinate = this.y + this.diameterSize / 2

    ctx.beginPath()
    ctx.arc(
      xCoordinate,
      yCoordinate,
      BOARD_SETTINGS.SPOT_RADIUS,
      0,
      2 * Math.PI
    )
    ctx.fillStyle = this._getColor()
    ctx.fill()
    ctx.lineWidth = BOARD_SETTINGS.SPOT_BORDER_WIDTH
    ctx.strokeStyle = this._getBorderColor()
    ctx.stroke()
  }

  setStatus(status) {
    this.state.status = status
  }

  getOwner() {
    return this.state.owner
  }

  setOwner(owner) {
    if (this.state.owner === null) {
      this.state.owner = owner
      this.setStatus(
        owner === PLAYERS_ID.USER
          ? SPOT_STATUSES.OWNER_USER
          : SPOT_STATUSES.OWNER_MACHINE
      )
    }
  }

  hasOwner() {
    return this.state.owner != null
  }
  _getColor() {
    return SPOT_COLORS_BY_STATUS[this.state.status]
  }

  _getBorderColor() {
    return SPOT_BORDER_COLORS_BY_STATUS[this.state.status]
  }
}
