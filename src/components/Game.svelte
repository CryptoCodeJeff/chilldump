<script>
  import { onMount, onDestroy } from 'svelte'
  import titleHTML from '../content/game/title.html?raw'
  import step1HTML from '../content/game/step1.html?raw'
  import step2HTML from '../content/game/step2.html?raw'
  import step3HTML from '../content/game/step3.html?raw'
  import socialsHTML from '../content/game/socials.html?raw'
  import areYouReady from '../content/game/areYouReady.html?raw'
  import justachilldumpHTML from '../content/game/justachilldump.html?raw'

  let {
    gameFinished = $bindable(false),
    calendarOpened = $bindable(false),
    easterEggOpened = $bindable(false),
    audioMuted = $bindable(false),
  } = $props()

  let gameContainer
  let game
  let shitsCollected = $state(0)
  let totalShits = $state(19)

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
          gravity: { y: 200 },
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

    let player, playerSprite
    let cursors, wasdKeys
    let sofaSound, jumpSound, fartSound

    function preload() {
      this.load.image('background', '/backgrounds/banner.png')
      this.load.image('player', '/sprites/normal.png')
      this.load.image('playerWalk', '/sprites/walk.png')
      this.load.image('playerWalk2', '/sprites/walk2.png')
      this.load.image('playerJump', '/sprites/jump2.png')
      this.load.image('playerJump2', '/sprites/jump.png')
      this.load.image('playerSit', '/sprites/sit.png')
      this.load.image('sofa', '/sprites/sofa.png')
      this.load.audio('sofaSound', '/sounds/cg8bit.wav')
      this.load.audio('jumpSound', '/sounds/jump.mp3')
      this.load.audio('fartSound', '/sounds/fart.wav')

      const shitNames = [
        'bullshit',
        'carrot',
        'cow',
        'cute',
        'death',
        'doge',
        'fire',
        'funny',
        'gay',
        'golden',
        'ice',
        'marciano',
        'pink',
        'rainbow',
        'rare',
        'robot',
        'shark',
        'shiba',
        'weird',
      ]

      shitNames.forEach((name) => {
        this.load.image(`shit_${name}`, `/sprites/shits/${name}.gif`)
      })
    }

    function create() {
      const { width, height } = this.scale

      // Creamos un mundo muy alto
      const worldHeight = 5000

      // Declaramos variables para los elementos que necesitan reposicionarse
      let titleDom, t1, t2, step1Dom, p1, step2Dom, p2, step3Dom, p3, socialsDom, areYouReadyDom, justachilldumpDom, sofaSprite, pSofa

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

        if (socialsDom) {
          socialsDom.setX(currentWidth / 2)
        }

        if (areYouReadyDom) {
          areYouReadyDom.setX(currentWidth / 2)
        }

        if (justachilldumpDom) {
          justachilldumpDom.setX(currentWidth / 2)
        }

        if (sofaSprite) {
          sofaSprite.setX(currentWidth / 2)
          pSofa.setX(currentWidth / 2)
          pSofa.body.updateFromGameObject()
        }

        // Reposicionar todos los shits proporcionalmente al centro
        shitsGroup.getChildren().forEach((shit) => {
          if (shit.xOffset !== undefined) {
            const newX = currentWidth / 2 + shit.xOffset
            shit.setX(newX)
            if (shit.associatedDom) {
              shit.associatedDom.setX(newX)
            }
          }
        })
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
      p1 = this.add.rectangle(width / 2 + 325, 690, 550, 20).setVisible(false)
      p1.associatedDom = step1Dom
      platforms.add(p1)

      // Paso 2
      step2Dom = this.add.dom(width / 2, 1200).createFromHTML(step2HTML)
      p2 = this.add.rectangle(width / 2 - 325, 1040, 550, 20).setVisible(false)
      p2.associatedDom = step2Dom
      platforms.add(p2)

      // Paso 3
      step3Dom = this.add.dom(width / 2, 1500).createFromHTML(step3HTML)
      p3 = this.add.rectangle(width / 2 + 325, 1370, 550, 20).setVisible(false)
      p3.associatedDom = step3Dom
      platforms.add(p3)

      // Sofa
      sofaSprite = this.add.sprite(width / 2, 2200, 'sofa').setScale(0.8)
      pSofa = this.add.rectangle(width / 2, 2200, 300, 40).setVisible(false)
      pSofa.associatedDom = sofaSprite
      platforms.add(pSofa)

      // Animación de flotado compleja (levitación + vibración jet)
      this.tweens.add({
        targets: sofaSprite,
        y: 2180,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      this.tweens.add({
        targets: sofaSprite,
        x: '+=2',
        duration: 50,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      // Are you ready?
      areYouReadyDom = this.add.dom(width / 2, 3000).createFromHTML(areYouReady)

      // Justachilldump
      justachilldumpDom = this.add.dom(width / 2, 4560).createFromHTML(justachilldumpHTML)

      // Social Links (debajo de justachilldump)
      socialsDom = this.add.dom(width / 2, 4750).createFromHTML(socialsHTML)

      socialsDom.addListener('click')
      socialsDom.on('click', (event) => {
        if (event.target.closest('#calendar-btn')) {
          calendarOpened = true
        }
        if (event.target.closest('#easteregg-btn')) {
          easterEggOpened = true
        }
      })

      // Sincronizar estado inicial de audio
      this.sound.mute = audioMuted

      // Grupo de Shits (coleccionables)
      const shitsGroup = this.physics.add.group()
      const shitNames = [
        'golden',
        'bullshit',
        'cow',
        'cute',
        'death',
        'shark',
        'doge',
        'fire',
        'funny',
        'gay',
        'ice',
        'marciano',
        'pink',
        'rainbow',
        'rare',
        'robot',
        'carrot',
        'shiba',
        'weird',
      ]

      // Repartimos los shits por el mundo
      // Los pondremos cerca de las plataformas o en el camino
      const shitPositions = [
        { x: width / 2 - 500, y: height / 2 - 200 }, // golden
        { x: width / 2 + 400, y: 200 }, // bullshit
        { x: width / 2 + 500, y: 600 }, // cow
        { x: width / 2 - 500, y: 600 }, // cute
        { x: width / 2 + 500, y: 1150 }, // death
        { x: width / 2 + 150, y: 1300 }, // shark
        { x: width / 2 - 200, y: 1450 }, // doge
        { x: width / 2, y: 1700 }, // fire
        { x: width / 2 - 250, y: 2400 }, // funny
        { x: width / 2 + 150, y: 2200 }, // gay
        { x: width / 2 - 450, y: 1800 }, // ice
        { x: width / 2 + 450, y: 1800 }, // marciano
        { x: width / 2 - 50, y: 2900 }, // pink
        { x: width / 2 + 50, y: 3200 }, // rainbow
        { x: width / 2, y: 3600 }, // rare
        { x: width / 2, y: 4000 }, // robot
        { x: width / 2 - 300, y: 4850 }, // carrot
        { x: width / 2 + 300, y: 4850 }, // shiba
        { x: width / 2, y: 4920 }, // weird
      ]

      shitPositions.forEach((pos, index) => {
        if (index < shitNames.length) {
          const name = shitNames[index]
          // Creamos un sensor físico (invisible) para la colisión
          const shitSensor = shitsGroup.create(pos.x, pos.y, `shit_${name}`)
          shitSensor.xOffset = pos.x - width / 2 // Guardamos la distancia al centro original
          shitSensor.setScale(0.2)
          shitSensor.setVisible(false) // No queremos ver el sprite estático
          shitSensor.body.setAllowGravity(false)

          // Creamos el elemento DOM para ver el GIF animado
          const shitDom = this.add
            .dom(pos.x, pos.y)
            .setScale(1.5)
            .createFromHTML(`<img src="/sprites/shits/${name}.gif" style="width: 50px; height: 50px; object-fit: contain;" />`)

          // Ocultar inicialmente
          shitDom.setAlpha(0)
          shitSensor.setActive(false)

          // Vinculamos el DOM al sensor para poder destruirlo después
          shitSensor.associatedDom = shitDom

          // Retraso de 1 segundo para aparecer
          this.time.delayedCall(2000, () => {
            // Animación de aparición
            this.tweens.add({
              targets: shitDom,
              alpha: 1,
              duration: 500,
              onComplete: () => {
                shitSensor.setActive(true)
              },
            })

            // Animación simple de flotado para ambos
            this.tweens.add({
              targets: [shitSensor, shitDom],
              y: pos.y - 20,
              duration: 1500 + Math.random() * 1000,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
            })
          })
        }
      })

      // Jugador (Cuerpo físico invisible)
      player = this.physics.add
        .sprite(width / 2 + 100, 0, 'player')
        .setScale(0.3)
        .setBounce(0)
        .setVisible(false)

      // Sprite Visual que sigue al cuerpo
      playerSprite = this.add.sprite(player.x, player.y, 'player').setScale(0.3)

      // Ajustamos el tamaño de la hitbox y el offset para centrarla
      // Dimensiones originales normal.png: 408x612
      player.body.setSize(280, 580)
      player.body.setOffset(64, 20)

      player.setCollideWorldBounds(true)
      player.body.onWorldBounds = true
      player.setDrag(100, 0) // Añadimos algo de resistencia al aire horizontal

      this.physics.world.on('worldbounds', (body, up, down, left, right) => {
        if (down && body.gameObject === player && !gameFinished) {
          gameFinished = true
        }
      })

      // Recolección de shits
      this.physics.add.overlap(player, shitsGroup, (player, shit) => {
        if (shit.associatedDom) {
          shit.associatedDom.destroy()
        }
        shit.destroy()
        shitsCollected++
        fartSound.play()

        if (shitsCollected >= totalShits) {
          const btn = socialsDom.getChildByID('easteregg-btn')
          if (btn) {
            btn.style.display = 'flex'
          }
        }
      })

      // Preparamos sonidos
      sofaSound = this.sound.add('sofaSound', { loop: false })
      jumpSound = this.sound.add('jumpSound', { loop: false })
      fartSound = this.sound.add('fartSound', { loop: false })

      // Colisión con plataformas
      this.physics.add.collider(player, platforms, (p, platform) => {
        const justLanded = p.body.touching.down && !p.body.wasTouching.down

        if (justLanded && platform === pSofa && !sofaSound.isPlaying) {
          sofaSound.play()
        }

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

      // Variables para el doble salto
      player.canDoubleJump = false

      // La cámara sigue al jugador instantáneamente (lerp 1) para evitar desfases y vibraciones
      this.cameras.main.startFollow(player, false, 1, 1)

      cursors = this.input.keyboard.createCursorKeys()
      wasdKeys = this.input.keyboard.addKeys('W,A,S,D')

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
      const leftDown = cursors.left.isDown || wasdKeys.A.isDown
      const rightDown = cursors.right.isDown || wasdKeys.D.isDown
      const upJustDown =
        Phaser.Input.Keyboard.JustDown(cursors.up) ||
        Phaser.Input.Keyboard.JustDown(wasdKeys.W) ||
        Phaser.Input.Keyboard.JustDown(cursors.space)
      const downDown = cursors.down.isDown || wasdKeys.S.isDown
      const moving = leftDown || rightDown

      if (leftDown) {
        player.setVelocityX(-200)
        playerSprite.setFlipX(false)
      } else if (rightDown) {
        player.setVelocityX(200)
        playerSprite.setFlipX(true)
      } else {
        player.setVelocityX(0)
      }

      // Lógica de salto y doble salto
      if (onGround) {
        player.canDoubleJump = true
        player.isDoubleJumping = false
        if (upJustDown) {
          player.setVelocityY(-200)
        }
      } else if (upJustDown && player.canDoubleJump) {
        player.setVelocityY(-350)
        player.canDoubleJump = false
        player.isDoubleJumping = true
        jumpSound.play()
      }

      // Sincronización base del sprite con el cuerpo
      playerSprite.x = player.x
      let visualOffsetY = 0

      // Animaciones y offsets
      if (downDown && onGround) {
        playerSprite.anims.stop()
        playerSprite.setTexture('playerSit')

        // Offset visual solicitado (+50)
        visualOffsetY = 30

        // Dimensiones del cuerpo (mantener hitbox normal)
        player.body.setSize(280, 540)
        player.body.setOffset(60, 20)
      } else {
        // Volver a dimensiones cuerpo normales
        player.body.setSize(280, 540)
        player.body.setOffset(64, 20)

        if (!onGround) {
          playerSprite.anims.stop()
          if (player.isDoubleJumping) {
            playerSprite.setTexture('playerJump2')
          } else {
            playerSprite.setTexture('playerJump')
          }
        } else if (moving) {
          playerSprite.play('walk', true)
        } else {
          playerSprite.anims.stop()
          playerSprite.setTexture('player')
        }
      }

      // Aplicar posición final con offset
      playerSprite.y = player.y + visualOffsetY
    }

    $effect(() => {
      if (game && game.sound) {
        game.sound.mute = audioMuted
      }
    })
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
