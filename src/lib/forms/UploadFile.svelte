<script>
  import { displaySuccess, displayWarning } from '../../js/toast.js';
  import { enhance } from '$app/forms';
  import Button from '$lib/forms/Button.svelte';

  let fileInput;

  let selectedFile;

  export let file;

  export let imageHeight;

  export let imageName;

  export let targetUserId = '';

  let isLoading = false;

  const onFileSelected = (e) => {
    selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (e) => {
      file = e.target.result;
    };
  };

  const onSubmit = (event) => {
    if (!fileInput?.files?.length) {
      event.preventDefault();
      displayWarning('Please select an image first.');
    }
  };

  const save = () => {
    isLoading = true;
    return async ({
      update,
      result
    }) => {
      await update({ reset: false });

      if (result.data.success) {
        displaySuccess('Successfully uploaded!');
      } else {
        displayWarning('Something went wrong. Please try again.');
      }

      isLoading = false;
    };
  };
</script>

<form action="?/uploadLogo" enctype="multipart/form-data" method="POST" on:submit={onSubmit} use:enhance={save}>
    <div class="mb-3">
        <input
                accept=".jpg, .jpeg, .png"
                bind:this={fileInput}
                class="form-control"
                name="image"
                on:change={(e) => onFileSelected(e)}
                type="file"
        />
        <small>Accepts .jpg, .jpeg, .png</small>
    </div>

    <input hidden name="imageHeight" value="{imageHeight}"/>
    <input hidden name="imageName" value="{imageName}"/>
    {#if targetUserId}
        <input hidden name="userId" value="{targetUserId}"/>
    {/if}

    <Button {isLoading}>Save image</Button>
</form>
