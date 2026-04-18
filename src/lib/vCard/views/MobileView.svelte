<script>
  export let width = '390px';
  export let height = '780px';
</script>

<div class="device-shell">
    <div class="phone" style="width: {width}; height: {height};">
        <div class="camera-bar"></div>
        <slot/>
    </div>
</div>

<style lang="scss">
  :root {
    --preview-scale: 1;
  }

  .device-shell {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .phone {
    position: relative;
    overflow: auto;
    border-radius: 2.4rem;
    background: #0f1f24;
    border: 8px solid #111827;
    box-shadow: 0 24px 45px rgba(2, 6, 23, 0.35);
    transform: scale(var(--preview-scale));
    transform-origin: center;
    transition: transform 200ms ease-out;
  }

  .camera-bar {
    position: sticky;
    top: 0.6rem;
    z-index: 2;
    width: 5.2rem;
    height: 0.35rem;
    border-radius: 999px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.22);
  }

  @media (max-width: 1460px) {
    :root {
      --preview-scale: 0.9;
    }
  }

  @media (max-width: 1360px) {
    :root {
      --preview-scale: 0.82;
    }
  }

  @media (max-width: 1240px) {
    :root {
      --preview-scale: 0.74;
    }
  }

  @media (max-width: 1120px) {
    :root {
      --preview-scale: 0.68;
    }
  }
</style>
