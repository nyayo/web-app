<script>
  import MobileView from '$lib/vCard/views/MobileView.svelte';
  import BusinessCard from '$lib/vCard/BusinessCard.svelte';

  export let vCard;

  export let theme;

  export let logoPreview;

  export let avatarPreview;

  export let coverPreview;
</script>

<MobileView>
    <BusinessCard {avatarPreview} {coverPreview} {logoPreview} {theme} {vCard}/>
</MobileView>
