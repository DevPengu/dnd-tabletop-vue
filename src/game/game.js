import Phaser from 'phaser';
// import GameScene from './scenes/gamescene';
import TestScene from './scenes/testscene';

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    scene: [
      TestScene,
    ],
    scale: {
      mode: Phaser.Scale.FIT,
      width: '100%',
      height: '100%',
    },
  });
}

export default launch;
export { launch };
