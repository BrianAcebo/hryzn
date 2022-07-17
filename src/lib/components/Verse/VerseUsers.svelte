<script>
  import { SearchIcon } from 'svelte-mono-icons';


  // Component props passed over
  export let members;
  export let owner;


  // Filter through all the members based on search term
  // Reactive function that automatically runs based on text/value change
  let searchTerm = '';
  let searchResults;
  let searching = false;
  let emptyResults = false;

  $: {

    if (searchTerm != '') {

      // Trigger search display and filter through members
      searching = true;
      searchResults = members.filter(member => member.member[0].username.toLowerCase().includes(searchTerm.toLowerCase()));
      emptyResults = searchResults.length == 0;
    } else {

      // Hide search display and empty search results
      searching = false;
      searchResults = [];
      emptyResults = false;
    }

  }
</script>


<!-- Verse Members Container -->
<div class="flex flex-col w-full p-5 justify-start card bg-base-300 rounded-box mt-5">


  <!-- Searchbar -->
  <div class="w-full flex justify-center items-center border-2 border-base-300 flex-row overflow-hidden mb-5">
    <input bind:value={searchTerm} type="text" placeholder="Users..." class="input input-ghost h-10 rounded-none rounded-l-lg bg-neutral-focus border-none w-3/4 m-0 placeholder:text-base-content outline_none" />

    <div class="w-1/4 flex justify-center items-center m-0 bg-base-100 h-10 rounded-r-lg">
      <label for="v-user-search" tabindex="0" class="cursor-pointer">
        <SearchIcon size="1.2x" class="icon_color" focusable="false" />
      </label>
    </div>
  </div>
  <!-- /Searchbar -->


  <!-- Members -->
  <div class="overflow-y-scroll no_scrollbar relative pb-5">


    <!-- Results -->
    {#if searching}

      {#if emptyResults}

      <p class="text-center my-10 block mx-auto">Sorry, we couldn't find what you're looking for.</p>

      {:else}

        {#each searchResults as member}
        {#if member.member[0].id == owner.data.id}
        <em class="text-xs block">Owner</em>
        {/if}
        <a href="/profile/{member.member[0].username}" class="text-sm flex flex-row mt-5 pl-3">
          <div class="w-5 h-5 rounded-full ring ring-primary ring-offset-base-50 ring-offset-1 overflow-hidden mr-3">
            <img class="w-full h-full object-center object-cover" src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{member.member[0].avatar_url}" alt="member"/>
          </div>
          @{member.member[0].username}
        </a>
        {/each}

      {/if}

    {:else}


    <!-- Verse Owner -->
    <em class="text-xs mb-5 block">Owner</em>
    
    <a href="/profile/{owner.data.username}" class="text-sm flex flex-row pl-3">
      <div class="w-5 h-5 rounded-full ring ring-primary ring-offset-base-50 ring-offset-1 overflow-hidden mr-3">
        <img class="w-full h-full object-center object-cover" src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{owner.data.avatar_url}" alt="owner"/>
      </div>
      @{owner.data.username}
    </a>
    <!-- /Verse Owner -->


    <!-- Verse Members -->
    <em class="text-xs mt-5 mb-5 block">Members</em>

    {#if members}
      {#each members as member}
        {#if member.member[0].id != owner.data.id}
        <a href="/profile/{member.member[0].username}" class="text-sm flex flex-row mb-5 pl-3">
          <div class="w-5 h-5 rounded-full ring ring-primary ring-offset-base-50 ring-offset-1 overflow-hidden mr-3">
            <img class="w-full h-full object-center object-cover" src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{member.member[0].avatar_url}" alt="member" />
          </div>
          @{member.member[0].username}
        </a>
        {/if}
      {/each}
    {/if}
    <!-- /Verse Members -->


    {/if}
    <!-- /Results -->


  </div>
  <!-- /Members -->


</div>
<!-- /Verse Members Container -->