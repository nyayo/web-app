<script>
  import {
    FileIcon,
    GlobeIcon,
    MailIcon,
    MapPinIcon,
    MessageSquareIcon,
    PhoneIcon,
    UserPlusIcon,
  } from 'svelte-feather-icons';
  import { onMount } from 'svelte';
  import VCardButton from '$lib/vCard/VCard.svelte';
  import Map from '$lib/maps/Map.svelte';
  import SocialIconLink from '$lib/forms/SocialIconLink.svelte';
  import SectionCard from '$lib/vCard/components/SectionCard.svelte';
  import ActionPill from '$lib/vCard/components/ActionPill.svelte';
  import ContactListItem from '$lib/vCard/components/ContactListItem.svelte';

  const ALIGN_TO_FLEX = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  };

  const ALIGN_TO_TEXT = {
    start: 'left',
    center: 'center',
    end: 'right',
  };

  const DEFAULT_COLORS = {
    primary: '#182d30',
    secondary: '#2f575d',
    background: '#dee1dd',
    contactIconBackground: '#182d30',
    contactIconFont: '#ffffff',
    buttonBackground: '#182d30',
    buttonFont: '#182d30',
  };

  const toText = (value) => (typeof value === 'string' ? value.trim() : '');

  const normalizeColor = (value, fallback) => {
    const color = toText(value);
    return color.length > 0 ? color : fallback;
  };

  const normalizeAlign = (value, fallback = 'start') => {
    const align = toText(value);
    return ALIGN_TO_FLEX[align] ? align : fallback;
  };

  const normalizeExternalLink = (value) => {
    const link = toText(value);
    if (!link.length) {
      return '';
    }

    return link.includes('://') ? link : `https://${link}`;
  };

  const parseCoordinate = (value) => {
    if (typeof value === 'number') {
      return Number.isFinite(value) && value !== 0 ? value : null;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed !== 0 ? parsed : null;
    }

    return null;
  };

  let addContactText = 'Add to contacts';

  onMount(async () => {
    const translationModule = await import('../../js/translations.js');
    addContactText =
      translationModule.translations[translationModule.browserLanguage] ||
      translationModule.translations.en;
  });

  export let view = 'preview';
  export let vCard;
  export let theme;
  export let logoPreview;
  export let avatarPreview;
  export let coverPreview;

  $: displayMode = view === 'preview' ? 'fixed-bottom-preview' : 'fixed-bottom-prod';

  $: primaryColor = normalizeColor(theme?.color?.font?.primary, DEFAULT_COLORS.primary);
  $: secondaryColor = normalizeColor(theme?.color?.font?.secondary, DEFAULT_COLORS.secondary);
  $: backgroundColor = normalizeColor(theme?.color?.background, DEFAULT_COLORS.background);
  $: contactIconBackground = normalizeColor(
    theme?.color?.contactIcons?.background,
    DEFAULT_COLORS.contactIconBackground
  );
  $: contactIconColor = normalizeColor(theme?.color?.contactIcons?.font, DEFAULT_COLORS.contactIconFont);
  $: buttonBackground = normalizeColor(theme?.color?.vCardBtn?.background, DEFAULT_COLORS.buttonBackground);
  $: buttonColor = normalizeColor(theme?.color?.vCardBtn?.font, DEFAULT_COLORS.buttonFont);

  $: logoAlign = normalizeAlign(theme?.align?.logo, 'start');
  $: avatarAlign = normalizeAlign(theme?.align?.avatar, 'center');
  $: headingAlign = normalizeAlign(theme?.align?.heading, 'center');
  $: bioAlign = normalizeAlign(theme?.align?.bio, 'center');
  $: socialAlign = normalizeAlign(theme?.align?.socialIcons, 'start');

  $: displayLogo = theme?.display?.logo !== false;
  $: displayPhone = theme?.display?.phone !== false;
  $: displaySms = theme?.display?.sms !== false;
  $: displayEmail = theme?.display?.email !== false;
  $: displayWeb = theme?.display?.web !== false;
  $: displayAddress = theme?.display?.address !== false;
  $: displayMap = theme?.display?.map !== false;
  $: displayVCardButton = theme?.display?.vCardBtn !== false;

  $: fullName = [vCard?.person?.firstName, vCard?.person?.middleName, vCard?.person?.lastName]
    .map(toText)
    .filter(Boolean)
    .join(' ');
  $: cardName = fullName || 'Virtual Card';

  $: role = toText(vCard?.professional?.role);
  $: company = toText(vCard?.professional?.company);
  $: pronouns = toText(vCard?.person?.pronouns);
  $: bio = toText(vCard?.professional?.bio);
  $: bioHtml = bio.replace(/(\r\n|\r|\n)/g, '<br>');

  $: logoSource =
    logoPreview || (theme?.logo?.format?.webp ? `data:image/webp;base64,${theme.logo.format.webp}` : '');
  $: logoHeight = Number(theme?.logo?.size?.height) > 0 ? Number(theme.logo.size.height) : 32;
  $: logoWidth = Number(theme?.logo?.size?.width) > 0 ? Number(theme.logo.size.width) : undefined;

  $: avatarSource =
    avatarPreview || (vCard?.avatar?.format?.webp ? `data:image/webp;base64,${vCard.avatar.format.webp}` : '');
  $: coverSource =
    coverPreview || (vCard?.cover?.format?.webp ? `data:image/webp;base64,${vCard.cover.format.webp}` : '');

  $: phoneNumber = toText(vCard?.contact?.phone?.number);
  $: countryCode = toText(vCard?.contact?.phone?.countryCode);
  $: extension = toText(vCard?.contact?.phone?.extension);
  $: hasPhone = phoneNumber.length > 0;
  $: telLink = hasPhone
    ? `${countryCode ? `+${countryCode}` : ''}${phoneNumber}${extension ? `,${extension}` : ''}`
    : '';
  $: formattedNumber = hasPhone
    ? `${countryCode ? `(+${countryCode}) ` : ''}${phoneNumber}`.trim()
    : '';
  $: smsLink = hasPhone ? `sms:${countryCode ? `+${countryCode}` : ''}${phoneNumber}` : '';

  $: email = toText(vCard?.contact?.email);
  $: website = toText(vCard?.contact?.web);
  $: websiteLink = normalizeExternalLink(website);
  $: fileName = toText(vCard?.contact?.file?.name);
  $: fileUrl = normalizeExternalLink(vCard?.contact?.file?.url);

  $: street = toText(vCard?.location?.street);
  $: storey = toText(vCard?.location?.storey);
  $: city = toText(vCard?.location?.city);
  $: state = toText(vCard?.location?.state);
  $: postalCode = toText(vCard?.location?.postalCode);
  $: country = toText(vCard?.location?.country);
  $: timeZone = toText(vCard?.location?.timeZone);

  $: hasAddress = [street, city, state, postalCode, country].some(Boolean);
  $: addressLineOne = [street, storey].filter(Boolean).join(', ');
  $: addressLineTwo = [postalCode, city, state].filter(Boolean).join(' ');
  $: mapsQuery = encodeURIComponent([street, postalCode, city, state, country].filter(Boolean).join(' '));
  $: addressLink = mapsQuery.length > 0 ? `https://www.google.com/maps/place/${mapsQuery}` : '';

  $: latitude = parseCoordinate(vCard?.location?.coordinates?.latitude);
  $: longitude = parseCoordinate(vCard?.location?.coordinates?.longitude);
  $: hasCoordinates = latitude !== null && longitude !== null;

  $: socialLinks = [
    { network: 'twitter', link: normalizeExternalLink(vCard?.socialMedia?.twitter) },
    { network: 'linkedin', link: normalizeExternalLink(vCard?.socialMedia?.linkedin) },
    { network: 'facebook', link: normalizeExternalLink(vCard?.socialMedia?.facebook) },
    { network: 'instagram', link: normalizeExternalLink(vCard?.socialMedia?.instagram) },
    { network: 'pinterest', link: normalizeExternalLink(vCard?.socialMedia?.pinterest) },
    { network: 'github', link: normalizeExternalLink(vCard?.socialMedia?.github) },
  ].filter(({ link }) => link.length > 0);

  $: showQuickActions =
    (displayPhone && hasPhone) || (displaySms && hasPhone) || (displayEmail && email.length > 0) || (displayWeb && websiteLink.length > 0);
</script>

<article
        class="business-card"
        style="
          --primary-color: {primaryColor};
          --secondary-color: {secondaryColor};
          --background-color: {backgroundColor};
          --contact-icon-background: {contactIconBackground};
          --contact-icon-color: {contactIconColor};
        "
>
    <div class="card-stack">
        <section
                class="cover-shell {coverSource ? 'with-image' : 'with-gradient'}"
                style={coverSource ? `--cover-image: url('${coverSource}');` : ''}
        >
            <div class="cover-overlay">
                {#if displayLogo && logoSource}
                    <div class="logo-panel" style="justify-content: {ALIGN_TO_FLEX[logoAlign]};">
                        <img
                                alt={company || cardName}
                                class="brand-logo"
                                height={logoHeight}
                                src={logoSource}
                                style="max-height: {logoHeight}px"
                            width={logoWidth}
                        />
                    </div>
                {/if}
            </div>
        </section>

        <section class="hero-panel {avatarSource ? 'with-overlap' : ''}">
            {#if avatarSource}
                <div class="avatar-row avatar-overlap" style="justify-content: {ALIGN_TO_FLEX[avatarAlign]}">
                    <img alt={cardName} class="avatar" height="136" src={avatarSource} width="136"/>
                </div>
            {/if}

            <div class="identity-block" style="text-align: {ALIGN_TO_TEXT[headingAlign]}">
                <h1>{cardName}</h1>
                {#if role || company}
                    <p class="role-line">{[role, company].filter(Boolean).join(' • ')}</p>
                {/if}
                {#if pronouns}
                    <p class="meta-line">{pronouns}</p>
                {/if}
            </div>

            {#if bio}
                <p class="bio" style="text-align: {ALIGN_TO_TEXT[bioAlign]}; color: var(--secondary-color)">
                    {@html bioHtml}
                </p>
            {/if}

            {#if showQuickActions}
                <div class="quick-actions">
                    {#if displayPhone && hasPhone}
                        <ActionPill
                                ariaLabel={`Call ${formattedNumber}`}
                                href={`tel:${telLink}`}
                                iconBackground={contactIconBackground}
                                iconColor={contactIconColor}
                                label="Call"
                        >
                            <PhoneIcon size="0.95x"/>
                        </ActionPill>
                    {/if}
                    {#if displaySms && hasPhone}
                        <ActionPill
                                ariaLabel={`Send message to ${formattedNumber}`}
                                href={smsLink}
                                iconBackground={contactIconBackground}
                                iconColor={contactIconColor}
                                label="Message"
                        >
                            <MessageSquareIcon size="0.95x"/>
                        </ActionPill>
                    {/if}
                    {#if displayEmail && email}
                        <ActionPill
                                ariaLabel={`Email ${email}`}
                                href={`mailto:${email}`}
                                iconBackground={contactIconBackground}
                                iconColor={contactIconColor}
                                label="Email"
                        >
                            <MailIcon size="0.95x"/>
                        </ActionPill>
                    {/if}
                    {#if displayWeb && websiteLink}
                        <ActionPill
                                ariaLabel={`Visit ${website}`}
                                href={websiteLink}
                                iconBackground={contactIconBackground}
                                iconColor={contactIconColor}
                                label="Website"
                                target="_blank"
                        >
                            <GlobeIcon size="0.95x"/>
                        </ActionPill>
                    {/if}
                </div>
            {/if}

            {#if socialLinks.length > 0}
                <ul class="social-icons" style="justify-content: {ALIGN_TO_FLEX[socialAlign]}">
                    {#each socialLinks as social}
                        <li>
                            <SocialIconLink
                                    link={social.link}
                                    network={social.network}
                                    size={34}
                            />
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>

        {#if (displayPhone && hasPhone) || (displayEmail && email) || (displayWeb && websiteLink) || (fileName && fileUrl) || (displayAddress && hasAddress)}
            <SectionCard
                    borderColor="rgba(24, 45, 48, 0.14)"
                    mutedColor={secondaryColor}
                    textColor={primaryColor}
                    title="Contact details"
            >
                {#if displayPhone && hasPhone}
                    <ContactListItem
                            ariaLabel={`Call ${formattedNumber}`}
                            href={`tel:${telLink}`}
                            iconBackground={contactIconBackground}
                            iconColor={contactIconColor}
                            label="Phone"
                            value={formattedNumber}
                    >
                        <PhoneIcon size="1x"/>
                    </ContactListItem>
                {/if}

                {#if displayEmail && email}
                    <ContactListItem
                            ariaLabel={`Email ${email}`}
                            href={`mailto:${email}`}
                            iconBackground={contactIconBackground}
                            iconColor={contactIconColor}
                            label="Email"
                            value={email}
                    >
                        <MailIcon size="1x"/>
                    </ContactListItem>
                {/if}

                {#if displayWeb && websiteLink}
                    <ContactListItem
                            ariaLabel={`Visit ${website}`}
                            href={websiteLink}
                            iconBackground={contactIconBackground}
                            iconColor={contactIconColor}
                            label="Website"
                            target="_blank"
                            value={website}
                    >
                        <GlobeIcon size="1x"/>
                    </ContactListItem>
                {/if}

                {#if fileName && fileUrl}
                    <ContactListItem
                            ariaLabel={fileName}
                            href={fileUrl}
                            iconBackground={contactIconBackground}
                            iconColor={contactIconColor}
                            label="File"
                            target="_blank"
                            value={fileName}
                    >
                        <FileIcon size="1x"/>
                    </ContactListItem>
                {/if}

                {#if displayAddress && hasAddress && addressLink}
                    <ContactListItem
                            ariaLabel="View address on map"
                            href={addressLink}
                            iconBackground={contactIconBackground}
                            iconColor={contactIconColor}
                            label="Address"
                            secondary={[addressLineTwo, country].filter(Boolean).join(' ')}
                            target="_blank"
                            value={addressLineOne || [addressLineTwo, country].filter(Boolean).join(' ')}
                    >
                        <MapPinIcon size="1x"/>
                    </ContactListItem>
                {/if}
            </SectionCard>
        {/if}

        {#if displayMap}
            <SectionCard
                    borderColor="rgba(24, 45, 48, 0.14)"
                    mutedColor={secondaryColor}
                    subtitle={timeZone || 'Location preview'}
                    textColor={primaryColor}
                    title="Map"
            >
                {#if hasCoordinates}
                    <div class="map-shell">
                        <Map {latitude} {longitude}/>
                    </div>
                {:else}
                    <div class="map-fallback">
                        <MapPinIcon size="1.1x"/>
                        <div>
                            <p>Map coordinates are not available yet.</p>
                            {#if addressLineOne || addressLineTwo || country}
                                <small>{[addressLineOne, addressLineTwo, country].filter(Boolean).join(' • ')}</small>
                            {/if}
                        </div>
                    </div>
                {/if}
            </SectionCard>
        {/if}
    </div>

    {#if displayVCardButton}
        <div class={`vcard-action ${displayMode}`}>
            <VCardButton
                    {vCard}
                    backgroundColor={buttonBackground}
                    color={buttonColor}
            >
                <UserPlusIcon size="1x"/>
                <span>{addContactText}</span>
            </VCardButton>
        </div>
    {/if}
</article>

<style lang="scss">
  .business-card {
    color: var(--primary-color);
    background: linear-gradient(180deg, color-mix(in srgb, var(--background-color) 90%, #fff 10%), var(--background-color));
    min-height: 100%;
  }

  .card-stack {
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
    padding: 1.1rem;
    padding-bottom: 1.5rem;
  }

  .cover-shell {
    position: relative;
    min-height: 188px;
    border-radius: 1.15rem;
    overflow: hidden;
    border: 1px solid rgba(24, 45, 48, 0.16);
  }

  .cover-shell.with-gradient {
    background:
      radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.45), transparent 38%),
      linear-gradient(130deg, #224b54, #3f737c 45%, #6ea0a8);
  }

  .cover-shell.with-image::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--cover-image);
    background-size: cover;
    background-position: center;
    transform: scale(1.02);
  }

  .cover-shell::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0.55));
  }

  .cover-overlay {
    position: relative;
    z-index: 1;
    height: 100%;
    min-height: inherit;
    padding: 0.9rem;
    display: flex;
    align-items: flex-start;
  }

  .logo-panel {
    display: flex;
    width: 100%;
  }

  .brand-logo {
    object-fit: contain;
    width: auto;
    max-width: min(72%, 240px);
    padding: 0.4rem 0.55rem;
    border-radius: 0.7rem;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.25);
  }

  .hero-panel {
    border: 1px solid rgba(24, 45, 48, 0.14);
    border-radius: 1.15rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(6px);
  }

  .hero-panel.with-overlap {
    margin-top: 0.2rem;
  }

  .avatar-row {
    display: flex;
  }

  .avatar-overlap {
    margin-top: -5.2rem;
    margin-bottom: 0.75rem;
    position: relative;
    z-index: 2;
  }

  .avatar {
    border-radius: 1.1rem;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.22);
  }

  .identity-block h1 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--primary-color);
    letter-spacing: -0.025em;
  }

  .role-line {
    margin: 0.32rem 0 0;
    color: var(--secondary-color);
    font-weight: 600;
  }

  .meta-line {
    margin: 0.25rem 0 0;
    color: var(--secondary-color);
    font-size: 0.84rem;
  }

  .bio {
    margin: 0.1rem 0 0;
    font-size: 0.95rem;
    line-height: 1.45;
  }

  .quick-actions {
    margin-top: 0.95rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .social-icons {
    list-style: none;
    margin: 1.05rem 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .map-shell {
    border-radius: 0.85rem;
    overflow: hidden;
    border: 1px solid rgba(24, 45, 48, 0.12);
  }

  .map-fallback {
    min-height: 160px;
    border: 1px dashed rgba(24, 45, 48, 0.24);
    border-radius: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.9rem;
    background: rgba(255, 255, 255, 0.75);
  }

  .map-fallback p {
    margin: 0;
    font-weight: 600;
  }

  .map-fallback small {
    color: var(--secondary-color);
  }

  .vcard-action {
    z-index: 1000;
    background: transparent;
    padding: 0.45rem 0.55rem 0.55rem;
  }

  .fixed-bottom-preview {
    position: sticky;
    bottom: 0;
  }

  @media (max-width: 500px) {
    .fixed-bottom-prod {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .card-stack {
      padding-bottom: 4.2rem;
    }

    .cover-shell {
      min-height: 168px;
    }
  }
</style>
