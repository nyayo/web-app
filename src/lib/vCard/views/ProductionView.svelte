<div class="production-shell">
    <div class="production-card">
        <slot/>
    </div>
</div>

<style lang="scss">
  .production-shell {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 1.6rem 1rem 2.6rem;
  }

  .production-card {
    width: min(100%, 540px);
    border-radius: 1.2rem;
    overflow: hidden;
    box-shadow: 0 24px 55px rgba(15, 23, 42, 0.24);
    border: 1px solid rgba(255, 255, 255, 0.45);
  }

  @media (max-width: 500px) {
    .production-shell {
      padding: 0;
    }

    .production-card {
      width: 100%;
      min-height: 100vh;
      border-radius: 0;
      box-shadow: none;
      border: none;
    }
  }
</style>
