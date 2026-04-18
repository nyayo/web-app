<script>
  import SvelteSeo from 'svelte-seo';
  import BusinessCard from '$lib/vCard/BusinessCard.svelte';
  import ProductionView from '$lib/vCard/views/ProductionView.svelte';
  import { createDefaultTheme, createDefaultVCard } from '$lib/defaults/data.js';

  export let data;

  const vCard = data?.vCard?.data || createDefaultVCard();
  const theme = data?.theme?.data || createDefaultTheme();

  const title = `${vCard.person.firstName} ${vCard.person.lastName}`.trim() || 'Virtual Card';
  const description = `${title}'s personal business card.`;
</script>

<SvelteSeo
        description={description}
        title={title}
/>

<div class="page-shell">
    <ProductionView>
        <BusinessCard {theme} {vCard} view="prod"/>
    </ProductionView>
</div>

<style>
  :global(body) {
    background:
      radial-gradient(circle at 15% 10%, rgba(221, 239, 228, 0.84), transparent 45%),
      radial-gradient(circle at 80% 90%, rgba(187, 209, 213, 0.62), transparent 48%),
      linear-gradient(145deg, #e5ece8, #cfdad8 45%, #dfe7ea);
    min-height: 100vh;
  }

  .page-shell {
    min-height: 100vh;
  }
</style>
