/* eslint-disable no-unused-vars */
export default class CamaraManager {
  constructor(scene) {
    this.scene = scene;

    this.maxZoom = 1.5;
    this.minZoom = 0.5;
  }

  create() {
    this.cam = this.scene.cameras.main;

    this.text = this.scene.add.text(0, 0, 'Click and drag to move', {
      font: '16px Courier', fill: '#0ff', backgroundColor: '#000c', fixedWidth: 200,
    }).setScrollFactor(0);

    this.scene.input.on('pointermove', (pointer) => {
      if (pointer.rightButtonDown()) {
        this.cam.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cam.zoom;
        this.cam.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cam.zoom;
      }
    });

    this.scene.input.on('wheel', (pointer, currentlyOver, deltaX, deltaY, deltaZ) => {
      const newZoom = this.cam.zoom - deltaY / 1000;

      if (this.maxZoom < newZoom || newZoom < this.minZoom) {
        return;
      }

      this.cam.zoom = newZoom;
    });
  }

  update() {
    this.text.setText(
      JSON.stringify(this.scene.input.activePointer, [
        'isDown',
        'downX',
        'downY',
        'worldX',
        'worldY',
        'x',
        'y',
        'position',
        'prevPosition',
      ], 2),
    );
  }
}

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
