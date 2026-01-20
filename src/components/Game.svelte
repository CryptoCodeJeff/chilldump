<script>
  import { onMount, onDestroy } from 'svelte'
  import titleHTML from '../content/game/title.html?raw'
  import step1HTML from '../content/game/step1.html?raw'
  import step2HTML from '../content/game/step2.html?raw'
  import step3HTML from '../content/game/step3.html?raw'

  let gameContainer
  let game

  onMount(async () => {
    const Phaser = (await import('phaser')).default

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer,
      transparent: true,
      dom: {
        createContainer: true,
        behindCanvas: true,
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
          gravity: { y: 400 },
          debug: false,
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
      // El fondo se ha movido al estilo CSS (.container) para que los
      // elementos HTML puedan estar entre el fondo y el personaje.

      // Grupo de plataformas invisibles
      const platforms = this.physics.add.staticGroup()

      // --- SECCIONES DE TEXTO ---

      // Título Principal
      const titleDom = this.add
        .dom(width / 2, height / 2)
        .createFromHTML(titleHTML)
        .setOrigin(0.5, 0.5)

      const t1 = this.add.rectangle(width / 2 - 300, height / 2 - 50, 600, 50).setVisible(false)
      const t2 = this.add.rectangle(width / 2, height / 2 + 25, 320, 10).setVisible(false)
      t1.associatedDom = titleDom
      t2.associatedDom = titleDom
      platforms.add(t1)
      platforms.add(t2)

      // Paso 1
      const step1Dom = this.add.dom(width / 2, 950).createFromHTML(step1HTML)
      const p1 = this.add.rectangle(width / 2 + 325, 730, 550, 20).setVisible(false)
      p1.associatedDom = step1Dom
      platforms.add(p1)

      // Paso 2
      const step2Dom = this.add.dom(width / 2, 1200).createFromHTML(step2HTML)
      const p2 = this.add.rectangle(width / 2 - 325, 1040, 550, 20).setVisible(false)
      p2.associatedDom = step2Dom
      platforms.add(p2)

      // Paso 3
      const step3Dom = this.add.dom(width / 2, 1500).createFromHTML(step3HTML)
      const p3 = this.add.rectangle(width / 2 + 325, 1340, 550, 20).setVisible(false)
      p3.associatedDom = step3Dom
      platforms.add(p3)

      // Jugador
      player = this.physics.add
        .sprite(width / 2 + 100, height / 2 - 55, 'player')
        .setSize(200, 470)
        .setScale(0.3)
        .setBounce(0) // Quitamos el rebote al personaje

      player.setCollideWorldBounds(true)

      // Colisión con plataformas con efecto de rebote en el suelo
      this.physics.add.collider(player, platforms, (p, platform) => {
        // Solo si el personaje acaba de aterrizar (no estaba tocando antes)
        const justLanded = p.body.touching.down && !p.body.wasTouching.down

        if (justLanded && platform.associatedDom && !platform.associatedDom.isBouncing) {
          platform.associatedDom.isBouncing = true

          this.tweens.add({
            targets: platform.associatedDom,
            y: platform.associatedDom.y + 15, // Baja 15 píxeles
            duration: 200,
            yoyo: true, // Vuelve a su sitio
            ease: 'Quad.easeInOut',
            onComplete: () => {
              platform.associatedDom.isBouncing = false
            },
          })
        }
      })

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
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('/backgrounds/banner.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    overflow: hidden;

    /* Forzamos que el canvas de Phaser esté por encima de todo */
    :global(canvas) {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      pointer-events: none; /* Los clics pasan al HTML de abajo */
    }

    /* El contenedor DOM de Phaser debe estar por debajo del canvas */
    :global(div[style*='position: absolute']) {
      z-index: 5 !important;
    }
  }
</style>

<div class="container">
  <div bind:this={gameContainer}></div>
</div>
