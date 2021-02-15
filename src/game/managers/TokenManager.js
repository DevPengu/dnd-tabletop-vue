/* eslint-disable class-methods-use-this */
export default class TokenManager {
  constructor(scene) {
    this.scene = scene;
  }

  createToken() {
    this.scene.add.rectangle(
      this.scene.game.input.activePointer.position.x,
      this.scene.game.input.activePointer.position.y,
      100, 100, 0x00ffff,
    );
  }
}
