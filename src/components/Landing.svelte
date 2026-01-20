<script>
  import Game from './Game.svelte'

  let gameFinished = $state(false)

  $effect(() => {
    if (gameFinished) {
      // TODO: Add completion overlay
    }
  })
</script>

<style lang="scss">
  @keyframes vanish-reappear {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .landing-wrapper {
    width: 100%;
    height: 100vh;

    &.gameFinished {
      img {
        transition: 4s ease-in;
        opacity: 1;
      }

      .game-container {
        width: 42%;
        height: 50vh;
        top: 24vh;
        margin: 0 auto;
        animation: vanish-reappear 2s forwards;
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
      transition: all 0s ease;
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
