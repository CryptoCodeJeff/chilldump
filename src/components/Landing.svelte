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

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      object-fit: cover;
    }

    .game-container {
      transition: 0.3s ease;
      width: 100%;
      height: 100vh;
      position: relative;

      &.gameFinished {
        transform: scale(0.4);
      }
    }
  }
</style>

<div class="landing-wrapper">
  <div class="game-container" class:gameFinished>
    <img src="/backgrounds/transparentTV.png" alt="" />
    <Game bind:gameFinished />
  </div>
</div>
