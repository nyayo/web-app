<script>
  import Preview from '$lib/layout/Preview.svelte';

  export let vCard;
  export let theme;
  export let logoPreview;
  export let avatarPreview;
</script>

<div class="preview-sticky">
    <Preview {avatarPreview} {logoPreview} {theme} {vCard}/>
</div>

<style>
  .preview-sticky {
    position: sticky;
    top: 1.25rem;
  }
</style>
