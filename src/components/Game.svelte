<script>
  import { onMount, onDestroy } from 'svelte'
  import titleHTML from '../content/game/title.html?raw'
  import step1HTML from '../content/game/step1.html?raw'
  import step2HTML from '../content/game/step2.html?raw'

  let gameContainer
  let game

  onMount(async () => {
    const Phaser = (await import('phaser')).default

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer,
      dom: {
        createContainer: true,
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%',
      },
      pixelArt: false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: true,
          fixedStep: false,
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

      // Creamos un mundo muy alto
      const worldHeight = 5000
      this.physics.world.setBounds(0, 0, width, worldHeight)
      this.cameras.main.setBounds(0, 0, width, worldHeight)

      // Fondo infinito
      const bg = this.add.tileSprite(width / 2, worldHeight / 2, width, worldHeight, 'background')
      bg.setScrollFactor(0)

      // Grupo de plataformas invisibles
      const platforms = this.physics.add.staticGroup()

      // --- SECCIONES DE TEXTO ---

      // Título Principal
      const titleDom = this.add.dom(width / 2, 200).createFromHTML(titleHTML)
      // Creamos un bloque físico que coincida con el título
      platforms.add(this.add.rectangle(width / 2, 200, width, 200).setVisible(false))

      // Paso 1
      const step1Dom = this.add.dom(width / 2, 1300).createFromHTML(step1HTML)
      // Creamos un bloque físico (ancho 600px como en el CSS, alto aprox 500px)
      platforms.add(this.add.rectangle(width / 2, 1300, 680, 550).setVisible(false))

      // Paso 2
      const step2Dom = this.add.dom(width / 2, 2300).createFromHTML(step2HTML)
      platforms.add(this.add.rectangle(width / 2, 2300, 680, 300).setVisible(false))

      // Jugador
      player = this.physics.add
        .sprite(width / 2, 0, 'player')
        .setSize(200, 450)
        .setScale(0.3)

      player.setCollideWorldBounds(true)

      // Colisión con plataformas
      this.physics.add.collider(player, platforms)

      // La cámara sigue al jugador instantáneamente (lerp 1) para evitar desfases y vibraciones
      this.cameras.main.startFollow(player, false, 1, 1)

      cursors = this.input.keyboard.createCursorKeys()

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
        player.setVelocityX(-200)
        player.setFlipX(false)
      } else if (cursors.right.isDown) {
        player.setVelocityX(200)
        player.setFlipX(true)
      } else {
        player.setVelocityX(0)
      }

      // Si no tocamos nada, caemos suavemente o podemos saltar
      if (cursors.up.isDown && onGround) {
        player.setVelocityY(-500)
      }

      // Animaciones
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

<style lang="scss">
  .game-wrapper {
    width: 100vw;
    height: 100vh;
    background: #000;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
  }

  /* Estilos para los elementos in-game */
  :global(.game-h1) {
    color: white;
    font-size: 80px;
    font-weight: bold;
    text-shadow: 5px 5px 0px black;
    display: flex;
    flex-direction: column;
    text-align: center;
    span {
      font-size: 120px;
    }
  }

  :global(.game-text-section) {
    max-width: 600px;
    color: white;
    font-family: 'Arial', sans-serif;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 20px;
    border: 4px solid var(--colorText2, #ff00ff);

    h2 {
      color: white;
      font-size: 40px;
      font-weight: bold;
      text-shadow: 3px 3px 0px black;
    }

    p {
      font-size: 20px;
      line-height: 1.4;
      text-align: justify;
    }
  }

  :global(canvas) {
    display: block;
  }
</style>

<div class="game-wrapper">
  <div bind:this={gameContainer}></div>
</div>
