<script>
  export let href = '';
  export let label = '';
  export let ariaLabel = '';
  export let target = '_self';
  export let iconBackground = '#182d30';
  export let iconColor = '#ffffff';
</script>

{#if href && label}
    <a
            aria-label={ariaLabel || label}
            class="action-pill"
            href={href}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            target={target}
    >
        <span class="icon-wrap" style="background: {iconBackground}; color: {iconColor}">
            <slot/>
        </span>
        <span class="label">{label}</span>
    </a>
{/if}

<style>
  .action-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 999px;
    padding: 0.45rem 0.75rem 0.45rem 0.4rem;
    text-decoration: none;
    color: inherit;
    border: 1px solid rgba(24, 45, 48, 0.14);
    background: rgba(255, 255, 255, 0.72);
    transition: transform 120ms ease, box-shadow 120ms ease;
  }

  .action-pill:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(16, 24, 40, 0.12);
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 999px;
  }

  .label {
    font-size: 0.82rem;
    font-weight: 600;
    white-space: nowrap;
  }
</style>
