<script>
  import { browser } from '$app/environment';
  import { PUBLIC_REST_API_URL } from '$env/static/public';

  export let vCard;
  export let className = '';
  export let backgroundColor = '#182d30';
  export let color = '#182d30';

  let link = '#';
  let inlineVcfContent = '';
  let filename = 'contact.vcf';

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

  /** @param {string} userAgent */
  const detectOperatingSystem = (userAgent) => {
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 3;
    }

    if (/Android|Windows|Linux/.test(userAgent)) {
      return 4;
    }

    return 3;
  };

  /** @param {any} card */
  const buildInlineVcfContent = (card) => {
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

    return vcfLines.join('\n');
  };

  const buildInlineVcfDataUri = () => `data:text/vcard;charset=utf-8,${encodeURIComponent(inlineVcfContent)}`;

  /** @param {Response} response */
  const parseFilenameFromResponse = (response) => {
    const headerValue = response.headers.get('content-disposition') || '';
    const matched = headerValue.match(/filename="([^"]+)"/i);
    return toText(matched?.[1]) || filename;
  };

  const shareVcfIfSupported = async () => {
    if (!browser || typeof navigator.share !== 'function') {
      return false;
    }

    let vcfText = inlineVcfContent;
    let sharedFilename = filename;

    if (!vcfText && link && !link.startsWith('data:')) {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`VCF request failed with status ${response.status}`);
      }

      vcfText = await response.text();
      sharedFilename = parseFilenameFromResponse(response);
    }

    if (!vcfText.length) {
      return false;
    }

    const vcfFile = new File([vcfText], sharedFilename, { type: 'text/vcard' });
    if (typeof navigator.canShare === 'function' && !navigator.canShare({ files: [vcfFile] })) {
      return false;
    }

    await navigator.share({
      title: 'Add contact',
      files: [vcfFile],
    });

    return true;
  };

  /** @param {MouseEvent} event */
  const handleClick = async (event) => {
    if (!browser) {
      return;
    }

    event.preventDefault();

    try {
      const shared = await shareVcfIfSupported();
      if (shared) {
        return;
      }
    } catch (error) {
      // Browser may reject share flow; direct VCF navigation fallback runs below.
      void error;
    }

    window.location.assign(link);
  };

  $: firstName = toText(vCard?.person?.firstName);
  $: lastName = toText(vCard?.person?.lastName);
  $: filename = `${firstName || 'contact'}${lastName ? `_${lastName}` : ''}.vcf`;
  $: inlineVcfContent = buildInlineVcfContent(vCard);

  $: {
    const apiBase = normalizeApiBase(PUBLIC_REST_API_URL || '');
    if (apiBase && vCard?.userId) {
      const userAgent = browser ? navigator.userAgent : '';
      link = `${apiBase}/api/v1/users/${vCard.userId}/vcf?v=${detectOperatingSystem(userAgent)}`;
    } else {
      link = buildInlineVcfDataUri();
    }
  }
</script>

<a
  class={`vcard-cta ${className}`.trim()}
  href={link}
  on:click={handleClick}
  rel="noopener noreferrer"
  style="--vcard-btn-bg: {backgroundColor}; --vcard-btn-color: {color};"
>
  <slot/>
</a>

<style>
  .vcard-cta {
    border: 1px solid color-mix(in srgb, var(--vcard-btn-bg) 82%, #000 18%);
    border-radius: 0.9rem;
    padding: 0.8rem 1rem;
    width: 100%;
    font-weight: 700;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    background: var(--vcard-btn-bg);
    color: var(--vcard-btn-color);
    text-decoration: none;
    box-shadow:
      0 6px 16px color-mix(in srgb, var(--vcard-btn-bg) 32%, transparent),
      inset 0 1px 0 color-mix(in srgb, #fff 22%, transparent);
    transition: transform 120ms ease, border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease;
  }

  .vcard-cta:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--vcard-btn-bg) 70%, #000 30%);
    background: color-mix(in srgb, var(--vcard-btn-bg) 90%, #000 10%);
    box-shadow:
      0 10px 20px color-mix(in srgb, var(--vcard-btn-bg) 35%, transparent),
      inset 0 1px 0 color-mix(in srgb, #fff 26%, transparent);
  }

  .vcard-cta:active {
    transform: translateY(0);
    box-shadow:
      0 4px 12px color-mix(in srgb, var(--vcard-btn-bg) 28%, transparent),
      inset 0 1px 0 color-mix(in srgb, #fff 18%, transparent);
  }
</style>
