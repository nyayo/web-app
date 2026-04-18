<script>
  export let label = '';
  export let value = '';
  export let href = '';
  export let target = '_self';
  export let ariaLabel = '';
  export let secondary = '';
  export let iconBackground = '#182d30';
  export let iconColor = '#ffffff';
</script>

{#if value}
    <div class="contact-item">
        <a
                aria-label={ariaLabel || label || value}
                class="icon-button"
                href={href || '#'}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                target={target}
                style="background: {iconBackground}; color: {iconColor}"
        >
            <slot/>
        </a>

        <div class="content">
            {#if label}
                <span class="label">{label}</span>
            {/if}
            {#if href}
                <a class="value" href={href} rel={target === '_blank' ? 'noopener noreferrer' : undefined} target={target}>
                    {value}
                </a>
            {:else}
                <span class="value">{value}</span>
            {/if}
            {#if secondary}
                <span class="secondary">{secondary}</span>
            {/if}
        </div>
    </div>
{/if}

<style>
  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    padding: 0.35rem 0;
  }

  .icon-button {
    flex-shrink: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.6rem;
    text-decoration: none;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .label {
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.75;
  }

  .value {
    color: inherit;
    font-size: 0.92rem;
    font-weight: 600;
    word-break: break-word;
    text-decoration: none;
  }

  .secondary {
    font-size: 0.82rem;
    opacity: 0.8;
  }
</style>
