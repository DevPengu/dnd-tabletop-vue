/* eslint-disable no-mixed-operators */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'TestScene',
    });
  }

  preload() {
    this.scale.pageAlignHorizontally = true;

    this.cameras.main.setBackgroundColor('#FFFFFF');

    this.load.image('pieza', './piezaUrl.jpg');
    this.load.image('aumentar', './aumentarUrl.jpg');
    this.load.image('reducir', './reducirUrl.jpg');
    this.load.image('reflejar', './reflejarUrl.jpg');
    this.load.image('rotar', './rotarUrl.jpg');
    this.load.image('mouse', './mouseUrl.jpg');

    this.maxZoom = 1.3;
    this.minZoom = 0.9;
    this.zoomFactor = 0.1;
    this.maxAngle = 360;
    this.angleFactor = 90;

    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

    this.actualPosition = {
      x: this.screenCenterX,
      y: 350,
    };

    this.origen = {
      angle: 90,
      scale: 1,
    };

    this.destino = {
      angle: 0,
      scale: 1.2,
    };

    this.currentSprite;
    this.moveSprite;
  }

  create() {
    this.piezaDestino = this.add.image(this.screenCenterX, 100, 'pieza');
    this.piezaDestino.setOrigin(0.5);
    this.piezaDestino.alpha = 0.8;
    this.piezaDestino.angle = this.destino.angle;
    this.piezaDestino.setScale(this.destino.scale);

    this.piezaOrigen = this.add.image(this.actualPosition.x, this.actualPosition.y, 'pieza');
    this.piezaOrigen.setOrigin(0.5);
    this.piezaOrigen.angle = this.origen.angle;
    this.piezaOrigen.setScale(this.origen.scale);
    this.piezaOrigen.setInteractive({ useHandCursor: true });
    this.piezaOrigen.on('pointerdown', this.selectCurrent, this); // This wont work TODO
    this.input.setDraggable(this.piezaOrigen);
    this.piezaOrigen.on('dragend', this.onDragStop, this); // This wont work TODO
    this.piezaOrigen.selected = false; // útil para el Drag and Drop

    this.aumentar = this.add.sprite(30, 30, 'aumentar').setInteractive();

    this.aumentar.on('pointerdown', () => {
      if (this.currentSprite) {
        let newScale = Math.abs(this.currentSprite.scale.x) + this.zoomFactor;
        if (newScale > this.maxZoom) {
          newScale = this.minZoom;
        }
        if (this.currentSprite.scale.x < 0) {
          newScale *= -1;
        }
        this.currentSprite.setScale(newScale);
      }
    });

    this.aumentar.input.useHandCursor = true; // TODO all of them
    this.aumentar.setOrigin(0.5);
    this.aumentar.setScale(0.8);

    this.reducir = this.add.sprite(30, 80, 'reducir').setInteractive();

    this.reducir.on('pointerdown', () => {
      if (this.currentSprite) {
        let newScale = Math.abs(this.currentSprite.scale.x) - this.zoomFactor;
        if (newScale < this.minZoom) {
          newScale = this.maxZoom;
        }
        if (this.currentSprite.scale.x < 0) {
          newScale *= -1;
        }
        this.currentSprite.setScale(newScale);
      }
    });

    this.reducir.input.useHandCursor = true; // TODO
    this.reducir.setOrigin(0.5);
    this.reducir.setScale(0.8);

    this.reflejar = this.add.sprite(30, 80, 'reflejar').setInteractive();

    this.reflejar.on('pointerdown', () => {
      if (this.currentSprite) {
        this.currentSprite.setScale(this.currentSprite.scale.x * -1);
      }
    });

    this.reflejar.input.useHandCursor = true; // TODO
    this.reflejar.setOrigin(0.5);
    this.reflejar.setScale(0.8);

    this.rotar = this.add.sprite(30, 80, 'rotar').setInteractive();

    this.rotar.on('pointerdown', () => {
      if (this.currentSprite) {
        let newAngle = this.currentSprite.angle + this.angleFactor;
        if (newAngle >= this.maxAngle) {
          newAngle = 0;
        }
        this.currentSprite.angle = newAngle;
      }
    });

    this.rotar.input.useHandCursor = true; // TODO
    this.rotar.setOrigin(0.5);
    this.rotar.setScale(0.8);

    this.mouse = this.add.sprite(this.screenCenterX, 400, 'mouse');
    this.mouse.setOrigin(0.5);
    // this.add.tween(this.mouse.scale).to({ x: 1.4, y: 1.4 }, 800, 'Linear', true, 0, -1).yoyo(true, 100);

    this.tweens.add({
      targets: this.mouse,
      alpha: 1.4,
      delay: 100,
      ease: 'Linear',
      yoyo: true,
    });
  }

  selectCurrent(sprite) {
    this.mouse.alpha = 0;
    if (this.currentSprite) {
      if (sprite.selected) {
        return;
      }
      this.currentSprite.selected = false;
      this.currentSprite.tint = this.currentSprite.prevTint;
    }
    this.currentSprite = sprite;
    this.currentSprite.selected = true;
    this.currentSprite.prevTint = this.currentSprite.tint;
    this.currentSprite.tint = Math.random() * 0xffffff;
  }

  checkOverlap(spriteA, spriteB) {
    const boundsA = spriteA.getBounds();
    const boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }

  onDragStop(sprite) {
    const self = this;
    if (this.checkOverlap(sprite, this.piezaDestino)
       && sprite.angle.toFixed(1) === this.destino.angle
       && sprite.scale.x.toFixed(1) === this.destino.scale) {
      sprite.removeInteractive();
      this.game.add.tween(sprite).to({ x: this.piezaDestino.x, y: this.piezaDestino.y }, 200, Phaser.Easing.Linear.None, true).onComplete.add(() => {
        sprite.animateRotate = true;
        self.piezaDestino.alpha = 0;
        self.game.add.tween(sprite.scale).to({ x: 0.5, y: 0.5 }, 2000, Phaser.Easing.Linear.None, true);
        self.game.add.tween(sprite).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
      });
    } else if (this.moveSprite && !this.moveSprite.isRunning || !this.moveSprite) {
      this.moveSprite = this.game.add.tween(sprite).to({ x: this.actualPosition.x, y: this.actualPosition.y }, 500, Phaser.Easing.Linear.None, true);
    }
  }

  update() {
    if (this.currentSprite && this.currentSprite.animateRotate) {
      this.currentSprite.angle += 10;
    }
  }
}
