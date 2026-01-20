<script>
  import { onMount, onDestroy } from 'svelte'
  import titleHTML from '../content/game/title.html?raw'
  import step1HTML from '../content/game/step1.html?raw'
  import step2HTML from '../content/game/step2.html?raw'
  import step3HTML from '../content/game/step3.html?raw'
  import areYouReady from '../content/game/areYouReady.html?raw'
  import justachilldumpHTML from '../content/game/justachilldump.html?raw'

  let { gameFinished = $bindable(false) } = $props()

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

      // Declaramos variables para los elementos que necesitan reposicionarse
      let titleDom, t1, t2, step1Dom, p1, step2Dom, p2, step3Dom, p3, areYouReadyDom, justachilldumpDom

      const updateResolution = () => {
        const { width: currentWidth, height: currentHeight } = this.scale

        // Calculamos el ratio horizontal antes de cambiar los límites para mantener al personaje en su sitio relativo
        const oldWidth = this.physics.world.bounds.width
        const playerRatioX = player ? player.x / oldWidth : 0.5

        // Actualizamos límites del mundo y cámara
        this.physics.world.setBounds(0, 0, currentWidth, worldHeight)
        this.cameras.main.setBounds(0, 0, currentWidth, worldHeight)

        // Reposicionamos al jugador según el nuevo ancho
        if (player) {
          player.setX(currentWidth * playerRatioX)
        }

        // Reposicionar Título (centrado)
        if (titleDom) {
          titleDom.setPosition(currentWidth / 2, currentHeight / 2)
          t1.setPosition(currentWidth / 2 - 300, currentHeight / 2 - 50)
          t1.body.updateFromGameObject()
          t2.setPosition(currentWidth / 2, currentHeight / 2 + 25)
          t2.body.updateFromGameObject()
        }

        // Reposicionar Pasos (centrados horizontalmente)
        if (step1Dom) {
          step1Dom.setX(currentWidth / 2)
          p1.setX(currentWidth / 2 + 325)
          p1.body.updateFromGameObject()
        }

        if (step2Dom) {
          step2Dom.setX(currentWidth / 2)
          p2.setX(currentWidth / 2 - 325)
          p2.body.updateFromGameObject()
        }

        if (step3Dom) {
          step3Dom.setX(currentWidth / 2)
          p3.setX(currentWidth / 2 + 325)
          p3.body.updateFromGameObject()
        }

        if (areYouReadyDom) {
          areYouReadyDom.setX(currentWidth / 2)
        }

        if (justachilldumpDom) {
          justachilldumpDom.setX(currentWidth / 2)
        }
      }

      // Escuchamos el evento de redimensión de Phaser
      this.scale.on('resize', updateResolution)

      // Grupo de plataformas invisibles
      const platforms = this.physics.add.staticGroup()

      // --- SECCIONES DE TEXTO ---

      // Título Principal
      titleDom = this.add
        .dom(width / 2, height / 2)
        .createFromHTML(titleHTML)
        .setOrigin(0.5, 0.5)

      t1 = this.add.rectangle(width / 2 - 300, height / 2 - 50, 600, 50).setVisible(false)
      t2 = this.add.rectangle(width / 2, height / 2 + 25, 320, 10).setVisible(false)
      t1.associatedDom = titleDom
      t2.associatedDom = titleDom
      platforms.add(t1)
      platforms.add(t2)

      // Paso 1
      step1Dom = this.add.dom(width / 2, 950).createFromHTML(step1HTML)
      p1 = this.add.rectangle(width / 2 + 325, 730, 550, 20).setVisible(false)
      p1.associatedDom = step1Dom
      platforms.add(p1)

      // Paso 2
      step2Dom = this.add.dom(width / 2, 1200).createFromHTML(step2HTML)
      p2 = this.add.rectangle(width / 2 - 325, 1040, 550, 20).setVisible(false)
      p2.associatedDom = step2Dom
      platforms.add(p2)

      // Paso 3
      step3Dom = this.add.dom(width / 2, 1500).createFromHTML(step3HTML)
      p3 = this.add.rectangle(width / 2 + 325, 1340, 550, 20).setVisible(false)
      p3.associatedDom = step3Dom
      platforms.add(p3)

      // Paso 4
      areYouReadyDom = this.add.dom(width / 2, 3000).createFromHTML(areYouReady)

      // Justachilldump
      justachilldumpDom = this.add.dom(width / 2, 4500).createFromHTML(justachilldumpHTML)

      // Jugador
      player = this.physics.add
        .sprite(width / 2 + 100, height / 2 - 55, 'player')
        .setSize(200, 470)
        .setScale(0.3)
        .setBounce(0)

      player.setCollideWorldBounds(true)
      player.body.onWorldBounds = true

      this.physics.world.on('worldbounds', (body, up, down, left, right) => {
        if (down && body.gameObject === player && !gameFinished) {
          gameFinished = true
        }
      })

      // Colisión con plataformas
      this.physics.add.collider(player, platforms, (p, platform) => {
        const justLanded = p.body.touching.down && !p.body.wasTouching.down

        if (justLanded && platform.associatedDom && !platform.associatedDom.isBouncing) {
          platform.associatedDom.isBouncing = true

          this.tweens.add({
            targets: platform.associatedDom,
            y: platform.associatedDom.y + 15,
            duration: 200,
            yoyo: true,
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
      updateResolution()
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
