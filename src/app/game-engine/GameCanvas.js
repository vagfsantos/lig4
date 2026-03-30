export class GameCanvas {
  width = null
  height = null
  canvas = null
  ctx = null

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  getCanvasSize() {
    return {
      width: this.width,
      height: this.height,
    }
  }

  getCanvas() {
    return this.canvas
  }

  getCanvasContext() {
    return this.ctx
  }

  setCanvasSize(width, height) {
    this.width = width
    this.height = height

    const pixelRate = window.devicePixelRatio || 1

    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'

    this.canvas.width = width * pixelRate
    this.canvas.height = height * pixelRate

    this.ctx.scale(pixelRate, pixelRate)
  }
}
