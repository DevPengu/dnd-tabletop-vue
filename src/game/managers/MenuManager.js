/* eslint-disable no-plusplus */
import Phaser from 'phaser';

export default class Container extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    this.visible = false;

    this.activeObject = null;

    this.scaleObjects = [];

    this.scaleUp = this.scene.add.rectangle(0, 0, 50, 50, 0xff11ff).setInteractive();
    this.add(this.scaleUp);
  }

  showMenu(gameObject) {
    this.activeObject = gameObject;
    this.visible = true;
    this.updateFollow(gameObject);
    this.generateResize();
  }

  hideMenu() {
    this.activeObject = null;
    this.visible = false;
    this.x = 0;
    this.y = 0;

    this.deleteScaleObjects();
  }

  updateFollow(gameObject) {
    if (gameObject === this.activeObject) {
      this.x = gameObject.x;
      this.y = gameObject.y - 50 - ((gameObject.height * gameObject.scale) / 2);

      for (let i = 0; i < this.scaleObjects.length; i++) {
        const scaleObject = this.scaleObjects[i];

        const pos = gameObject.getTopRight();

        scaleObject.x = pos.x;
        scaleObject.y = pos.y;
      }
    }
  }

  generateResize() {
    this.deleteScaleObjects();
    const topRight = this.scene.add.rectangle(
      this.activeObject.x + ((this.activeObject.width * this.activeObject.scale) / 2),
      this.activeObject.y - ((this.activeObject.height * this.activeObject.scale) / 2),
      10, 10, 0xffffff,
    );
    topRight.isScaleObject = true;

    this.scaleObjects.push(topRight);

    topRight.setInteractive();
  }

  deleteScaleObjects() {
    for (let i = 0; i < this.scaleObjects.length; i++) {
      const scaleObject = this.scaleObjects[i];

      scaleObject.destroy();
    }
    this.scaleObjects = [];
  }
}
