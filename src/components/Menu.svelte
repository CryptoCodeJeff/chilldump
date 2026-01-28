<script>
  let { calendarOpened = $bindable(false), audioMuted = $bindable(false) } = $props()

  const links = [
    { name: 'Official X', href: 'https://x.com/justachilldump', icon: '/x.png' },
    { name: 'Pumpfun', href: 'https://dumpfun.io/?r=SOSdmyoGb', icon: '/dumpfun.jpg' },
  ]
</script>

<style lang="scss">
  .menu {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    z-index: 1000;
    pointer-events: none;

    .menu-inner {
      pointer-events: auto;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 10px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(var(--colorPrimaryRgb), 0.5);
        background: rgba(0, 0, 0, 0.6);
      }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--fontPrimary);
      font-weight: bold;
      font-size: 1.2rem;
      letter-spacing: 2px;
      color: white;

      img {
        width: 35px;
        height: 35px;
        object-fit: contain;
      }
    }

    .nav-links {
      display: flex;
      gap: 25px;
      align-items: center;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-weight: bold;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;

      .nav-icon {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        transition: transform 0.3s ease;
      }

      span {
        font-family: var(--fontSecondary);
      }

      &:hover {
        color: var(--colorPrimary);

        .nav-icon {
          transform: scale(1.2) rotate(5deg);
        }
      }
    }
  }

  @media (max-width: 768px) {
    .menu {
      width: 95%;
      top: 10px;

      .logo span {
        display: none;
      }

      .nav-links span {
        display: none;
      }

      .nav-links {
        gap: 15px;
      }
    }
  }
</style>

<nav class="menu">
  <div class="menu-inner">
    <div class="logo">
      <img src="/sprites/normal.png" alt="Chilldump Logo" />
      <span>CHILLDUMP</span>
    </div>

    <div class="nav-links">
      {#each links as link}
        <a href={link.href} target="_blank" class="nav-item">
          <img src={link.icon} alt={link.name} class="nav-icon" />
          <span>{link.name}</span>
        </a>
      {/each}
      <button class="nav-item calendar-trigger" onclick={() => (calendarOpened = true)}>
        <img src="/calendar.png" alt="Calendar" class="nav-icon" />
        <span>Roadmap</span>
      </button>
      <button
        class="nav-item"
        onclick={() => {
          audioMuted = !audioMuted
          // Forzamos el silenciado a nivel global de Phaser si existe
          if (typeof window !== 'undefined' && window.Phaser) {
            window.Phaser.GAMES.forEach((g) => {
              if (g.sound) g.sound.mute = audioMuted
            })
          }
        }}
      >
        <span class="nav-icon" style="font-size: 24px; display: flex; align-items: center; justify-content: center;">
          {audioMuted ? '🔇' : '🔊'}
        </span>
      </button>
    </div>
  </div>
</nav>
