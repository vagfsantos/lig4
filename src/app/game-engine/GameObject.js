export const GAME_OBJECT_TYPES = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
}

class GameObjectEvent {
  events = {
    mousemove: [],
  }

  onEvent({ name, callback }) {
    this.events[name].push(callback)
  }

  watchForEvents({ DOMElement = window }) {
    const allEvents = Object.keys(this.events)

    allEvents.forEach((eventName) => {
      DOMElement.addEventListener(eventName, (event) => {
        const rangeX = {
          start: this.x,
          end: this.x + this.width,
        }
        const rangeY = {
          start: this.y,
          end: this.y + this.height,
        }

        const isInsideXArea =
          event.offsetX >= rangeX.start && event.offsetX <= rangeX.end

        const isInsideYArea =
          event.offsetY >= rangeY.start && event.offsetY <= rangeY.end

        const isInsideGameObjectArea = isInsideXArea && isInsideYArea

        this.events[eventName].forEach((callback) => {
          callback({ isInsideGameObjectArea, rawEvent: event })
        })
      })
    })
  }
}

export class GameObject extends GameObjectEvent {
  name = null
  type = GAME_OBJECT_TYPES.DYNAMIC
  width = null
  height = null
  x = 0
  y = 0

  constructor({ name }) {
    super()
    if (typeof name !== 'string')
      throw new Error('Name is required to create a game object')

    this.name = name
  }

  setCoordinates({ x, y }) {
    this.x = x || this.x
    this.y = y || this.y
  }

  update() {
    if (this.type === 'dynamic')
      throw new Error(
        `Method update not implemented on: ${this.name}. If you want to create a static game object set type to "static" on your class`
      )
  }

  render() {
    throw new Error(`Method render not implemented on: ${this.name}`)
  }
}
