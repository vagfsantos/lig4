export class GameObject {
  constructor({ name, x = 0, y = 0 }) {
    if (typeof name !== "string")
      throw new Error("Name is required to create a game object");

    this.name = name;
    this.x = x;
    this.y = y;
  }

  update() {
    throw new Error(`Method update not implemented on: ${this.name}`);
  }

  render({ gameCanvas }) {
    throw new Error(`Method render not implemented on: ${this.name}`);
  }
}
