<script>
  import Game from './Game.svelte'
  import Menu from './Menu.svelte'

  let gameFinished = $state(false)

  let weeks = $state([
    { date: '04 Jan 2026', ca: '-', grow: '-' },
    { date: '11 Jan 2026', ca: '-', grow: '-' },
    { date: '18 Jan 2026', ca: '-', grow: '-' },
    { date: '25 Jan 2026', ca: '-', grow: '-' },
    { date: '01 Feb 2026', ca: '-', grow: '-' },
    { date: '08 Feb 2026', ca: '-', grow: '-' },
    { date: '15 Feb 2026', ca: '-', grow: '-' },
    { date: '22 Feb 2026', ca: '-', grow: '-' },
    { date: '01 Mar 2026', ca: '-', grow: '-' },
    { date: '08 Mar 2026', ca: '-', grow: '-' },
    { date: '15 Mar 2026', ca: '-', grow: '-' },
    { date: '22 Mar 2026', ca: '-', grow: '-' },
    { date: '29 Mar 2026', ca: '-', grow: '-' },
  ])

  const now = new Date()
  let initialWeekIndex = 0
  for (let i = 0; i < weeks.length; i++) {
    // La semana actual es la que termina el próximo domingo
    if (now <= new Date(weeks[i].date + ' 20:00')) {
      initialWeekIndex = i
      break
    }
  }

  let currentWeekIndex = $state(initialWeekIndex)
  let selectedIndex = $state(initialWeekIndex)

  let calendarOpened = $state(false)
  let easterEggOpened = $state(false)
  let showControls = $state(true)

  function handleKeyDown(e) {
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
      showControls = false
      window.removeEventListener('keydown', handleKeyDown)
    }
  }

  $effect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

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

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .landing-wrapper {
    width: 100%;
    min-height: 100vh;

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

    .calendar {
      position: absolute;
      display: flex;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.95);
      transition:
        opacity 0.3s ease,
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        visibility 0.3s;

      &.opened {
        visibility: visible;
        opacity: 1;
        pointer-events: all;
        transform: scale(1);
      }

      background-color: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(15px);
      width: 42%;
      height: 50vh;
      top: 24vh;
      margin: 0 auto;
      left: 0;
      right: 0;
      z-index: 99;
      padding: 2rem;
      border-radius: 20px;
      border: 1px solid rgba(var(--colorPrimaryRgb), 0.3);
      box-shadow:
        0 25px 50px -12px rgba(0, 0, 0, 0.5),
        inset 0 0 20px rgba(255, 255, 255, 0.05);
      flex-direction: column;
      gap: 1.5rem;

      .close-btn {
        position: absolute;
        top: 1.25rem;
        right: 1.25rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        color: white;
        cursor: pointer;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1001;

        &:hover {
          transform: rotate(90deg) scale(1.1);
          background: rgba(var(--colorPrimaryRgb), 0.2);
          border-color: var(--colorPrimary);
          color: var(--colorPrimary);
          box-shadow: 0 0 15px rgba(var(--colorPrimaryRgb), 0.4);
        }

        &:active {
          transform: rotate(90deg) scale(0.95);
        }
      }

      h3 {
        margin: 0;
        text-align: center;
        font-size: 2.5rem;
        color: white;
        text-transform: uppercase;
        letter-spacing: 4px;
        font-weight: 900;
        text-shadow: 0 0 20px rgba(var(--colorPrimaryRgb), 0.5);
      }
      .content {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .week-grid {
          display: grid;
          justify-content: center;
          grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
          width: 100%;
          gap: 8px;

          .week-box {
            aspect-ratio: 1;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.4);
            transition: all 0.2s ease;
            cursor: pointer;
            font-size: 1.1rem;

            &:hover {
              background: var(--colorPrimary);
              color: white;
              border-color: transparent;
              box-shadow: 0 0 20px rgba(var(--colorPrimaryRgb), 0.5);
              transform: translateY(-2px);
            }

            &.active {
              background: var(--colorPrimary);
              color: white;
              border-color: transparent;
              box-shadow: 0 0 25px rgba(var(--colorPrimaryRgb), 0.6);
            }

            &.current {
              border: 2px solid white;
              color: white;
            }

            &.completed {
              opacity: 0.6;
            }
          }
        }

        .data {
          width: 100%;
          height: 100%;
          min-height: 27vh;
          background: rgba(255, 255, 255, 0.02);
          padding: 1.5rem;
          border-radius: 15px;

          p {
            font-size: 24px;
            margin: 0.5rem 0;
            color: rgba(255, 255, 255, 0.7);
          }

          a {
            text-decoration: none;
            p:hover span {
              color: var(--colorPrimary);
              text-decoration: underline;
            }
          }
        }
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
      pointer-events: none;
    }

    .game-container {
      transition: all 0s ease;
      width: 100%;
      height: 100vh;
      position: relative;
    }

    .controls-hint {
      position: absolute;
      top: 140px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      color: white;
      text-align: center;
      opacity: 0.7;
      pointer-events: none;
      user-select: none;
      transition: opacity 0.5s ease;

      .hint-title {
        font-size: 14px;
        letter-spacing: 4px;
        margin-bottom: 15px;
        font-weight: 900;
        font-family: var(--fontSecondary);
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      }

      .hint-keys {
        display: flex;
        gap: 15px;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-family: var(--fontSecondary);
        font-weight: bold;

        span {
          border: 1px solid rgba(255, 255, 255, 0.5);
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .separator {
          opacity: 0.5;
          border: none;
          background: none;
          padding: 0;
          box-shadow: none;
          backdrop-filter: none;
          font-size: 12px;
        }
      }
    }
  }
</style>

<div class="landing-wrapper" class:gameFinished>
  <Menu bind:calendarOpened />
  <img src="/backgrounds/transparentTV.png" alt="" />

  {#if showControls}
    <div class="controls-hint">
      <div class="hint-title">CONTROLS</div>
      <div class="hint-keys">
        <span>WASD</span>
        <span class="separator">OR</span>
        <span>ARROWS</span>
      </div>
    </div>
  {/if}

  <div class="calendar" class:opened={easterEggOpened}>
    <button class="close-btn" onclick={() => (easterEggOpened = false)} aria-label="Close easter egg">
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        stroke="currentColor"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <h3>1 Year Coin</h3>

    <div class="content">
      <div class="data">
        <p>Congratulations! You've found the <span>Easter Egg</span>.</p>
        <p>This coin represents the <span>1 Year Anniversary</span> of the project.</p>
        <p>
          <a href="https://dumpfun.io/dumpflow/88nNskUmu3ZybwWEHeBRz2nNoFYzQd3kdesHdPbNdump" target="_blank"
            >CA: <span>88nNskUmu3ZybwWEHeBRz2nNoFYzQd3kdesHdPbNdump</span></a
          >
        </p>
      </div>
    </div>
  </div>

  <div class="calendar" class:opened={calendarOpened}>
    <button class="close-btn" onclick={() => (calendarOpened = false)} aria-label="Close calendar">
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        stroke="currentColor"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <h3>Season Q1</h3>

    <div class="content">
      <div class="data">
        <p>
          Selling date: <span>
            {weeks[selectedIndex].date} - 20:00 (UTC)
          </span>
        </p>
        <p>Growth: <span>{weeks[selectedIndex].grow}</span></p>

        <a href={`https://dumpfun.io/dumpflow/${weeks[selectedIndex].ca}`} target="_blank">
          <p>CA: <span>{weeks[selectedIndex].ca}</span></p>
        </a>
      </div>

      <div class="week-grid">
        {#each weeks as week, i}
          <button
            type="button"
            class="week-box"
            class:active={i === selectedIndex}
            class:current={i === currentWeekIndex}
            class:completed={new Date(week.date + ' 20:00') < now}
            onclick={() => (selectedIndex = i)}
          >
            {#if new Date(week.date + ' 20:00') < now}
              ✓
            {:else}
              {i + 1}
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="game-container">
    <Game bind:gameFinished bind:calendarOpened bind:easterEggOpened />
  </div>
</div>
