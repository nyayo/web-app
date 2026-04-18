<script>
  import { PUBLIC_REST_API_URL } from '$env/static/public';
  import { onMount } from 'svelte';

  export let vCard;
  export let className = '';
  export let backgroundColor = '#182d30';
  export let color = '#182d30';

  let link = '#';

  /** @param {unknown} value */
  const toText = (value) => (typeof value === 'string' ? value.trim() : '');

  const normalizeApiBase = (url = '') => url.replace(/\/+$/, '').replace(/\/api\/v1$/, '');

  /** @param {unknown} value */
  const normalizeWebUrl = (value) => {
    const web = toText(value);
    if (!web.length) {
      return '';
    }

    return web.includes('://') ? web : `https://${web}`;
  };

  const detectOperatingSystem = () => {
    const userAgent = window.navigator.userAgent;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 3;
    }

    if (/Android|Windows|Linux/.test(userAgent)) {
      return 4;
    }

    return 3;
  };

  /** @param {any} card */
  const buildInlineVcfDataUri = (card) => {
    const firstName = toText(card?.person?.firstName);
    const lastName = toText(card?.person?.lastName);
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Contact';
    const role = toText(card?.professional?.role);
    const company = toText(card?.professional?.company);
    const email = toText(card?.contact?.email);
    const phoneNumber = toText(card?.contact?.phone?.number);
    const phoneCountryCode = toText(card?.contact?.phone?.countryCode);
    const website = normalizeWebUrl(card?.contact?.web);

    const vcfLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${fullName}`,
      `N:${lastName};${firstName};;;`,
    ];

    if (company.length) {
      vcfLines.push(`ORG:${company}`);
    }
    if (role.length) {
      vcfLines.push(`TITLE:${role}`);
    }
    if (phoneNumber.length) {
      const tel = `${phoneCountryCode ? `+${phoneCountryCode}` : ''}${phoneNumber}`;
      vcfLines.push(`TEL;TYPE=CELL:${tel}`);
    }
    if (email.length) {
      vcfLines.push(`EMAIL;TYPE=INTERNET:${email}`);
    }
    if (website.length) {
      vcfLines.push(`URL:${website}`);
    }

    vcfLines.push('END:VCARD');

    return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcfLines.join('\n'))}`;
  };

  onMount(() => {
    const apiBase = normalizeApiBase(PUBLIC_REST_API_URL || '');
    if (apiBase && vCard?.userId) {
      link = `${apiBase}/api/v1/users/${vCard.userId}/vcf?v=${detectOperatingSystem()}`;
      return;
    }

    link = buildInlineVcfDataUri(vCard);
  });
</script>

<a
  class={`vcard-cta ${className}`.trim()}
  href={link}
  rel="noopener noreferrer"
  style="--vcard-btn-bg: {backgroundColor}; --vcard-btn-color: {color};"
>
  <slot/>
</a>

<style>
  .vcard-cta {
    border: 1px solid color-mix(in srgb, var(--vcard-btn-color) 30%, transparent);
    border-radius: 0.9rem;
    padding: 0.8rem 1rem;
    width: 100%;
    font-weight: 700;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    background: transparent;
    color: var(--vcard-btn-color);
    text-decoration: none;
    transition: transform 120ms ease, border-color 120ms ease, background-color 120ms ease;
  }

  .vcard-cta:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--vcard-btn-color) 55%, transparent);
    background: color-mix(in srgb, var(--vcard-btn-bg) 8%, transparent);
  }

  .vcard-cta:active {
    transform: translateY(0);
  }
</style>
