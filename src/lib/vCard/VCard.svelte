<script>
  import { PUBLIC_REST_API_URL } from '$env/static/public';
  import { onMount } from 'svelte';

  export let vCard;
  export let className = '';
  export let backgroundColor = '#182d30';
  export let color = '#ffffff';

  let link = '';

  const detectOperatingSystem = () => {
    const userAgent = window.navigator.userAgent;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 3;
    }

    if (/Android|Windows|Linux/.test(userAgent)) {
      return 4;
    }

    return 3;
  };

  const normalizeApiBase = (url = '') => url.replace(/\/+$/, '').replace(/\/api\/v1$/, '');

  onMount(() => {
    const apiBase = normalizeApiBase(PUBLIC_REST_API_URL || '');
    if (!apiBase || !vCard?.userId) {
      link = '';
      return;
    }

    link = `${apiBase}/api/v1/users/${vCard.userId}/vcf?v=${detectOperatingSystem()}`;
  });

  const handleClick = () => {
    if (!link) {
      return;
    }

    window.location.href = link;
  };
</script>

<button
        class={`vcard-cta ${className}`.trim()}
        disabled={!link}
        on:click={handleClick}
        style="--vcard-btn-bg: {backgroundColor}; --vcard-btn-color: {color};"
        type="button"
>
    <slot/>
</button>

<style>
  .vcard-cta {
    border: 0;
    border-radius: 0.9rem;
    padding: 0.85rem 1rem;
    width: 100%;
    font-weight: 700;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--vcard-btn-bg) 90%, #fff 10%),
      var(--vcard-btn-bg)
    );
    color: var(--vcard-btn-color);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
    transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;
  }

  .vcard-cta:hover:enabled {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.28);
    filter: saturate(1.04);
  }

  .vcard-cta:active:enabled {
    transform: translateY(0);
  }

  .vcard-cta:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
  }
</style>
