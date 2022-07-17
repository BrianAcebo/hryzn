<script>
  import { HomeIcon, AddIcon, ExploreIcon } from 'svelte-mono-icons';
</script>


<a href="/">
  <label for="nav-home" tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
    <HomeIcon size="1.5x" class="icon_color" focusable="false" />
  </label>
</a>


<a href="/explore">
  <label for="nav-explore" tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
    <ExploreIcon size="1.5x" class="icon_color" focusable="false" />
  </label>
</a>


<label for="create-verse" tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
  <AddIcon size="1.5x" class="icon_color" focusable="false" />
</label>

