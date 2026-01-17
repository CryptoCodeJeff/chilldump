<script>
  import { onMount, onDestroy } from 'svelte'

  let gameContainer
  let game

  onMount(async () => {
    // Importación dinámica para evitar problemas con SSR en Astro
    const Phaser = (await import('phaser')).default

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%',
      },
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    }

    game = new Phaser.Game(config)

    let player
    let cursors

    function preload() {
      this.load.image('background', '/backgrounds/banner.png')
      this.load.image('player', '/sprites/normal.png')
      this.load.image('playerWalk', '/sprites/walk.png')
      this.load.image('playerWalk2', '/sprites/walk2.png')
      this.load.image('playerJump', '/sprites/jump.png')
    }

    function create() {
      const { width, height } = this.scale

      // Añadir el fondo y escalarlo para que cubra toda la pantalla
      const bg = this.add.image(width / 2, height / 2, 'background')
      const scaleX = width / bg.width
      const scaleY = height / bg.height
      const scale = Math.max(scaleX, scaleY)
      bg.setScale(scale).setScrollFactor(0)

      player = this.physics.add.sprite(width / 2, height / 2, 'player').setScale(0.3)
      player.setCollideWorldBounds(true)
      cursors = this.input.keyboard.createCursorKeys()

      // Crear animación de caminar alternando frames
      this.anims.create({
        key: 'walk',
        frames: [{ key: 'player' }, { key: 'playerWalk' }],
        frameRate: 5,
        repeat: -1,
      })
    }

    function update() {
      const onGround = player.body.blocked.down
      const moving = cursors.left.isDown || cursors.right.isDown

      if (cursors.left.isDown) {
        player.setVelocityX(-160)
        player.setFlipX(false)
      } else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.setFlipX(true)
      } else {
        player.setVelocityX(0)
      }

      if (cursors.up.isDown && onGround) {
        player.setVelocityY(-400)
      }

      // Lógica de animaciones y texturas
      if (!onGround) {
        player.anims.stop()
        player.setTexture('playerJump')
      } else if (moving) {
        player.play('walk', true)
      } else {
        player.anims.stop()
        player.setTexture('player')
      }
    }
  })

  onDestroy(() => {
    if (game) game.destroy(true)
  })
</script>

<style>
  .game-wrapper {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    overflow: hidden;
  }

  /* Asegura que el canvas de Phaser se comporte bien */
  :global(canvas) {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: contain;
  }
</style>

<div class="game-wrapper">
  <div bind:this={gameContainer}></div>
</div>
