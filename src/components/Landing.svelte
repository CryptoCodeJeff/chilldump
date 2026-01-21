<script>
  import Game from './Game.svelte'

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
  let currentWeekIndex = 0
  for (let i = 0; i < weeks.length; i++) {
    // La semana actual es la que termina el próximo domingo
    if (now <= new Date(weeks[i].date + ' 20:00')) {
      currentWeekIndex = i
      break
    }
  }

  let selectedIndex = $state(currentWeekIndex)

  let calendarOpened = $state(false)

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

    .calendar {
      position: absolute;
      display: none;

      &.opened {
        display: flex;
      }

      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      width: 42%;
      height: 50vh;
      top: 24vh;
      margin: 0 auto;
      left: 0;
      right: 0;
      z-index: 99;
      padding: 2rem;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      h3 {
        margin: 0;
        text-align: center;
        font-size: 2rem;
        color: white;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      .content {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .week-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          width: 100%;
          gap: 5px;

          .week-box {
            aspect-ratio: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
            cursor: pointer;

            &:hover {
              background: var(--colorPrimary);
              color: white;
              box-shadow: 0 0 15px var(--colorPrimary);
            }

            &.active {
              background: var(--colorPrimary);
              color: white;
              border-color: var(--colorPrimary);
            }

            &.current {
              border: 2px solid white;
            }

            &.completed {
              border-color: var(--colorPrimary);
              color: white;
              position: relative;

              &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--colorPrimary);
                opacity: 0.2;
                border-radius: inherit;
              }
            }
          }
        }

        .data {
          width: 100%;
          height: 100%;
          min-height: 27vh;

          p {
            font-size: 30px;
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
  }
</style>

<div class="landing-wrapper" class:gameFinished>
  <img src="/backgrounds/transparentTV.png" alt="" />

  <div class="calendar" class:opened={calendarOpened}>
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
            {i + 1}
          </button>
        {/each}
      </div>
      <button class="close-btn" onclick={() => (calendarOpened = false)}>Close</button>
    </div>
  </div>

  <div class="game-container">
    <Game bind:gameFinished bind:calendarOpened />
  </div>
</div>
