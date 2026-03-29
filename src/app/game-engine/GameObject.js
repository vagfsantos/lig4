export const GAME_OBJECT_TYPES = {
  STATIC: "static",
  DYNAMIC: "dynamic",
};

export class GameObject {
  type = GAME_OBJECT_TYPES.DYNAMIC;

  constructor({ name, x = 0, y = 0 }) {
    if (typeof name !== "string")
      throw new Error("Name is required to create a game object");

    this.name = name;
    this.x = x;
    this.y = y;
  }

  setCoordinates({ x, y }) {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  update() {
    if (this.type === "dynamic")
      throw new Error(
        `Method update not implemented on: ${this.name}. If you want to create a static game object set type to "static" on your class`,
      );
  }

  render({ gameCanvas }) {
    throw new Error(`Method render not implemented on: ${this.name}`);
  }
}
