<script>
  import { Icon } from 'svelte-icons-pack';
  import {
    FaBrandsFacebookF,
    FaBrandsGithub,
    FaBrandsInstagram,
    FaBrandsLinkedinIn,
    FaBrandsPinterestP,
    FaBrandsXTwitter,
  } from 'svelte-icons-pack/fa';

  const ICON_MAP = {
    twitter: FaBrandsXTwitter,
    linkedin: FaBrandsLinkedinIn,
    facebook: FaBrandsFacebookF,
    instagram: FaBrandsInstagram,
    pinterest: FaBrandsPinterestP,
    github: FaBrandsGithub,
  };

  const NETWORK_STYLE = {
    twitter: {
      fg: '#ffffff',
      bg: '#111111',
    },
    linkedin: {
      fg: '#ffffff',
      bg: '#0A66C2',
    },
    facebook: {
      fg: '#ffffff',
      bg: '#1877F2',
    },
    instagram: {
      fg: '#ffffff',
      bg: 'radial-gradient(circle at 30% 105%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
    },
    pinterest: {
      fg: '#ffffff',
      bg: '#E60023',
    },
    github: {
      fg: '#ffffff',
      bg: '#181717',
    },
  };

  export let link;
  export let network;
  export let size = 32;
  export let fontColor = '';
  export let backgroundColor = '';

  $: icon = ICON_MAP[network];
  $: styleToken = NETWORK_STYLE[network] || { fg: '#ffffff', bg: '#1f2937' };
</script>

{#if link && icon}
    <a aria-label={network} class="social-link" href={link} rel="noopener noreferrer" target="_blank">
        <span
                class="social-icon"
                style="--icon-color: {styleToken.fg}; --icon-bg: {styleToken.bg}; --icon-size: {size}px;"
        >
            <Icon size={`${Math.max(size - 12, 14)}px`} src={icon}/>
        </span>
    </a>
{/if}

<style>
  .social-link {
    color: inherit;
    text-decoration: none;
  }

  .social-icon {
    width: var(--icon-size);
    height: var(--icon-size);
    border-radius: 0.78rem;
    color: var(--icon-color);
    background: var(--icon-bg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 9px 20px rgba(15, 23, 42, 0.22);
    transition: transform 120ms ease, box-shadow 120ms ease;
  }

  .social-link:hover .social-icon {
    transform: translateY(-2px);
    box-shadow: 0 14px 26px rgba(15, 23, 42, 0.28);
  }
</style>
