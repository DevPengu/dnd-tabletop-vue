/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
// import io from 'socket.io-client';

import InteractManager from '../managers/InteractManager';
import MenuManager from '../managers/MenuManager.js';
import TokenManager from '../managers/TokenManager';
import CamaraManager from '../managers/camaraManager';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload() {

  }

  create() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const gridCenterX = Math.floor(screenCenterX / 70) * 70 + 35; // TODO the best way?
    const gridCenterY = Math.floor(screenCenterY / 70) * 70 + 35;

    this.add.grid(gridCenterX, gridCenterY, 70 * 20, 70 * 20, 70, 70, 0x00b952);

    this.menuManager = new MenuManager(this);
    this.interactManager = new InteractManager(this);
    this.tokenManager = new TokenManager(this);
    this.camaraManager = new CamaraManager(this);

    this.camaraManager.create();

    this.test = this.add.rectangle(1000, 500, 70, 70, 0x00ffff);
    this.test.setInteractive();
    this.input.setDraggable(this.test);

    this.test2 = this.add.rectangle(1000, 450, 25, 25, 0xffffff);

    this.test.on('drag', (pointer, dragX, dragY) => {
      this.test.x = dragX;
      this.test.y = dragY;

      this.test2.x = this.test.x;
      this.test2.y = this.test.y - 50;
    });

    this.token = this.add.rectangle(1000, 300, 70, 70, 0x00ffff);
    this.token2 = this.add.rectangle(700, 100, 70, 70, 0x00ffff);

    this.interactManager.dragObject([this.token, this.token2]);
  }

  update() {
    this.interactManager.update();
    this.camaraManager.update();
  }
}
