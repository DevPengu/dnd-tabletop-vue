<template>
  <div id="gamemaster">
    <div id="game">
      <Game />
    </div>

    <div id="border"></div>
    <div id="input">
      <Chat />
    </div>
  </div>
</template>

<script>
import Chat from '@/components/Chat.vue';
import Game from '@/components/Game.vue';

export default {
  name: 'Home',
  components: {
    Chat,
    Game,
  },
};
</script>

<style>
  #gamemaster {
    font-family: 'Trebuchet MS';
    text-align: left;
    background-color: black;
    color: cyan;
    display: flex;
  }
  #game {
    width: 80vw;
    height: 100vh;
  }
  #input {
    width: 20vw;
    height: 100vh;
  }
  #border {
    border-right: 2px solid cyan;
  }
  * {
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
</style>
