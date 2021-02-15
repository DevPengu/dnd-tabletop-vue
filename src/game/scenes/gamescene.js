/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
// import io from 'socket.io-client';

import InteractManager from '../managers/InteractManager';
import MenuManager from '../managers/MenuManager.js';
import TokenManager from '../managers/TokenManager';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload() {

  }

  create() {
    this.add.grid(735, 735, 70 * 20, 70 * 20, 70, 70, 0x00b952);

    this.menuManager = new MenuManager(this);
    this.interactManager = new InteractManager(this);
    this.tokenManager = new TokenManager(this);

    // this.add.grid(300, 340, 512, 256, 64, 64, 0x00b952);

    // this.cameras.main.setBounds(0, 0, 1024, 1024);

    // this.cameras.main.setZoom(1);
    // this.cameras.main.centerOn(0, 0);

    // this.input.on('pointerdown', function () {
    //   const cam = this.cameras.main;

    //   cam.pan(500, 500, 2000, 'Power2');
    //   cam.zoomTo(4, 3000);
    // }, this);

    //--------

    this.test = this.add.rectangle(500, 500, 70, 70, 0x00ffff);
    this.test.setInteractive();
    this.input.setDraggable(this.test);

    this.test2 = this.add.rectangle(500, 450, 25, 25, 0xffffff);

    this.test.on('drag', (pointer, dragX, dragY) => {
      this.test.x = dragX;
      this.test.y = dragY;

      this.test2.x = this.test.x;
      this.test2.y = this.test.y - 50;
    });

    this.token = this.add.rectangle(300, 300, 70, 70, 0x00ffff);
    this.token2 = this.add.rectangle(100, 100, 70, 70, 0x00ffff);

    this.interactManager.dragObject([this.token, this.token2]);
  }

  update() {
    this.interactManager.update();
  }
}
