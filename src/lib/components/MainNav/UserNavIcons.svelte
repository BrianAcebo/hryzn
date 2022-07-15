<script>
  import { HomeIcon, AddIcon, CompassIcon } from 'svelte-mono-icons';
</script>


<a href="/">
  <label tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
    <HomeIcon size="1.5x" class="icon_color" focusable="false" />
  </label>
</a>


<a href="/explore">
  <label tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
    <CompassIcon size="1.5x" class="icon_color" focusable="false" />
  </label>
</a>


<label for="create-verse" tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
  <AddIcon size="1.5x" class="icon_color" focusable="false" />
</label>

