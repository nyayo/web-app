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

  export let link;
  export let network;
  export let size = 22;
  export let fontColor = '';
  export let backgroundColor = '';

  $: icon = ICON_MAP[network];
  $: iconForeground = fontColor.length > 0 ? fontColor : '#1f2937';
  $: iconBackground = backgroundColor.length > 0 ? backgroundColor : '#ffffff';
</script>

{#if link && icon}
    <a aria-label={network} class="social-link" href={link} rel="noopener noreferrer" target="_blank">
        <span class="social-icon" style="--icon-color: {iconForeground}; --icon-bg: {iconBackground}; --icon-size: {size}px;">
            <Icon size={`${Math.max(size - 8, 12)}px`} src={icon}/>
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
    border-radius: 0.65rem;
    border: 1px solid rgba(24, 45, 48, 0.16);
    color: var(--icon-color);
    background: var(--icon-bg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12);
    transition: transform 120ms ease, box-shadow 120ms ease;
  }

  .social-link:hover .social-icon {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
  }
</style>
