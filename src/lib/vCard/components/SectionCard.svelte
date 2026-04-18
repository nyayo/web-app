<script>
  export let title = '';
  export let subtitle = '';
  export let textColor = '#182d30';
  export let mutedColor = '#4d5f63';
  export let borderColor = 'rgba(24, 45, 48, 0.12)';
</script>

<section class="section-card" style="--text-color: {textColor}; --muted-color: {mutedColor}; --border-color: {borderColor};">
    {#if title || subtitle}
        <header class="section-header">
            {#if title}
                <h2>{title}</h2>
            {/if}
            {#if subtitle}
                <p>{subtitle}</p>
            {/if}
        </header>
    {/if}
    <div class="section-content">
        <slot/>
    </div>
</section>

<style>
  .section-card {
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);
  }

  .section-header {
    margin-bottom: 0.85rem;
  }

  .section-header h2 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .section-header p {
    margin: 0.25rem 0 0;
    color: var(--muted-color);
    font-size: 0.85rem;
  }
</style>
