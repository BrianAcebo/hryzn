<script>
  import Icon from 'svelte-awesome';
  import home from 'svelte-awesome/icons/home';
  import compass from 'svelte-awesome/icons/compass';
  import plus from 'svelte-awesome/icons/plus';
</script>


<a href="/">
  <label for="nav-home" tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
    <Icon data={home} scale="1.5"/>
  </label>
</a>


<a href="/explore">
  <label for="nav-explore" tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
    <Icon data={compass} scale="1.5"/>
  </label>
</a>


<label for="create-verse" tabindex="0" class="btn btn-ghost btn-circle mt-2 mb-2">
  <Icon data={plus} scale="1.5"/>
</label>

