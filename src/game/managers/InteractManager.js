/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

export default class InteractManager {
  constructor(scene) {
    this.scene = scene;
    this.selectedObject = null;
    this.selectedObjectResize = null;
    this.selectedObjectScale = null;

    this.scaleObject = null;
    this.scaleStartX = null;
    this.scaleStartY = null;

    this.scaleObjects = [];

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.wasDragged = true;

      this.moveObject(gameObject, dragX, dragY);
    });

    scene.input.on('dragend', (pointer, gameObject) => {
      if (gameObject.isScaleObject) return;
      if (gameObject.scale % 2) {
        const moveX = 70 * Math.round(gameObject.x / 70);
        const moveY = 70 * Math.round(gameObject.y / 70);
        this.moveObject(gameObject, moveX, moveY);
      } else {
        const moveX = 70 * Math.floor(gameObject.x / 70) + 35;
        const moveY = 70 * Math.floor(gameObject.y / 70) + 35;
        this.moveObject(gameObject, moveX, moveY);
      }
    });

    scene.input.on('gameobjectup', (pointer, gameObject) => {
      if (!gameObject.wasDragged && !gameObject.isScaleObject && gameObject !== this.selectedObject) {
        this.selectedObject = gameObject;

        scene.menuManager.showMenu(gameObject);
      }

      gameObject.wasDragged = false;
    });

    scene.input.on('gameobjectdown', (pointer, gameObject) => {
      if (this.selectedObject && gameObject.isScaleObject) {
        this.scaleStartX = scene.game.input.activePointer.position.x;
        this.scaleStartY = gameObject.y;
        this.scaleObject = gameObject;
        this.selectedObjectScale = this.selectedObject.scale;
      }
    });

    scene.input.on('pointerup', (pointer, currentlyOver) => {
      console.log(currentlyOver);
      if (currentlyOver.length === 0 && !this.selectedObjectResize) {
        this.selectedObject = null;

        scene.menuManager.hideMenu();
      }

      if (this.selectedObjectResize) {
        this.selectedObject.setScale(Math.round(this.selectedObject.scale));
        scene.menuManager.updateFollow(this.selectedObject);
      }

      this.selectedObjectResize = null;

      this.scaleObject = null;
      this.scaleStartX = null;
      this.scaleStartY = null;
      this.selectedObjectScale = null;
    });

    this.update = () => {
      if (this.selectedObject && this.scaleObject) {
        if (!this.selectedObjectResize) this.selectedObjectResize = true;

        const wRatio = (scene.game.input.activePointer.position.x - this.scaleStartX) / this.selectedObject.width;
        // const hRatio = (scene.game.input.activePointer.position.y - this.scaleStartY) / this.selectedObject.height;

        // TODO only works on the x axes

        this.scaleObject.x = this.selectedObject.x + (this.selectedObject.width * this.selectedObject.scale) / 2;
        this.scaleObject.y = this.selectedObject.y - (this.selectedObject.height * this.selectedObject.scale) / 2;

        this.selectedObject.setScale((wRatio * 2) + this.selectedObjectScale);
      }
    };
  }

  dragObject(object) {
    let newObjects = [];
    console.log(object);
    Array.isArray(object) ? newObjects = newObjects.concat(object) : newObjects.push(object);

    for (let i = 0; i < newObjects.length; i++) {
      const curObject = newObjects[i];

      console.log(curObject);

      curObject.setInteractive();
    }

    this.scene.input.setDraggable(newObjects);
  }

  moveObject(gameObject, x, y) {
    gameObject.x = x;
    gameObject.y = y;

    this.scene.menuManager.updateFollow(gameObject);
  }
}
