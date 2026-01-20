<script>
  import Game from './Game.svelte'

  let gameFinished = $state(false)

  $effect(() => {
    if (gameFinished) {
      // TODO: Add completion overlay
    }
  })
</script>

<style class="scss">
  .landing-wrapper {
    width: 100%;
    height: 100vh;

    &.gameFinished {
      img {
        transition: 3s ease-in;
        opacity: 1;
      }

      .game-container {
        width: 42%;
        height: 50vh;
        top: 24vh;
        margin: 0 auto;
      }
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      object-fit: cover;
      opacity: 0;
    }

    .game-container {
      transition: all 0.5s ease;
      width: 100%;
      height: 100vh;
      position: relative;
    }
  }
</style>

<div class="landing-wrapper" class:gameFinished>
  <img src="/backgrounds/transparentTV.png" alt="" />
  <div class="game-container">
    <Game bind:gameFinished />
  </div>
</div>
