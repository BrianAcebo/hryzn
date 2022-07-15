<script context="module">
  import { supabase } from "$lib/utils/supabase";
  import PostCard from "$lib/components/Verse/PostCard.svelte";
  import { SearchIcon } from 'svelte-mono-icons';


  export async function load({params}) {
    

    // Get the verse data with ssr from the url slug
    // Return the data as page props


    const slug = params.slug; // url slug


    try {

      
      // Get verse data
      const { data:verse, error, status } = await supabase
        .from('verses')
        .select()
        .eq('slug', slug)
        .single()


      // Get pages data
      const { data:pages } = await supabase
        .from('pages')
        .select('*')
        .eq('verse_attached', verse.id)
        .order('updated_at', { ascending: false })


      // Get verse owner data
      const owner = await supabase
        .from('profiles')
        .select()
        .eq('id', verse.owner)
        .single()


      // Get the members data
      let allMembers;
      if (verse.members.length > 1) {
        allMembers = await Promise.all(verse.members.map(async (id) => {
          const { data:member } = await supabase
            .from('profiles')
            .select()
            .eq('id', id)

          return {
            member: member
          }
        }));
      }


      // Get posts data
      const { data:posts } = await supabase
        .from('posts')
        .select('*')
        .eq('verse_attached', verse.id)
        .order('updated_at', { ascending: false })

      let allPosts;
      if (posts && posts.length > 0) {
        allPosts = await Promise.all(posts.map(async (data) => {

          const postOwner = await supabase
            .from('profiles')
            .select()
            .eq('id', data.owner)
            .single()

          return {
            id: data.id,
            owner: postOwner,
            text: data.text,
            image_urls: data.image_urls,
            video_url: data.video_url,
          }
        }));
      }


      return { props: { 
        verse,
        allPosts,
        owner,
        allMembers,
        pages
      } };


    } catch (err) {
      console.log('Error: ', err);
    }
  }
</script>


<script>
  import VerseNav from '$lib/components/Verse/VerseNav.svelte';
  import { user } from "$lib/stores/user";
  import { currentVersePage } from "$lib/stores/Verse/currentVersePage";
  import { mainPage } from "$lib/stores/mainPage";
  import MobileBtmNav from '$lib/components/Site/MobileBtmNav.svelte';
  import { openRightMobileNav } from "$lib/stores/openMobileNav";
  import VerseMeta from '$lib/components/Verse/VerseMeta.svelte';
  import VerseUsers from '$lib/components/Verse/VerseUsers.svelte';


  // This is to interchange between the chevron icon and the search bar in top nav
  // Search bar shows on a main page, and chevron shows on a 'sub' page to go back to the main page
  mainPage.set({
      isMainPage: false,
      mainPage: $mainPage.mainPage
  });


  // This is to change the underline for verse links
  currentVersePage.set('archive');


  // Props data from SSR above
  export let verse;
  export let allPosts;
  export let pages;
  export let allMembers;
  export let owner;


  // Check if user is viewing their own verse
  const isOwnerOfVerse = $user.id == verse.owner;


  // Filter through all the posts based on search term
  // Reactive function that automatically runs based on text/value change
  let searchTerm = '';
  let searchResults;
  let searching = false;
  let emptyResults = false;

  $: {

    if (searchTerm != '') {

      // Trigger search display and filter through posts
      searching = true;
      searchResults = allPosts.filter(post => (post.text && post.text.toLowerCase().includes(searchTerm.toLowerCase())) || post.owner.data.username.toLowerCase().includes(searchTerm.toLowerCase()));
      emptyResults = searchResults.length == 0;
    } else {

      // Hide search display and empty search results
      searching = false;
      searchResults = [];
      emptyResults = false;
    }

  }
</script>


<svelte:head>
    <title>{verse.name} | Hryzn</title>
    <meta property="og:title" name="og:title" content="{verse.name} | Hryzn" />
    <meta property="description" name="description" content="{verse.description ? verse.description : 'Hryzn is a social platform where communities can connect through niche topics.'}" />
    <meta property="og:description" name="og:description" content="{verse.description ? verse.description : 'Hryzn is a social platform where communities can connect through niche topics.'}" />
</svelte:head>


{#await verse then verse}


<!-- Verse Container -->
<div class="flex flex-col w-full lg:flex-row p-10 max-h-[90vh]">


  <!-- Left Verse -->
  <VerseNav verse={verse} {isOwnerOfVerse} pages={false} />
  <!-- /Left Verse -->


  <div class="divider lg:divider-horizontal lg:flex hidden"></div>


  <!-- Archive Of Posts -->
  <div class="lg:w-3/4 w-full">


    <!-- Searchbar -->
    <div class="overflow-hidden w-full h-[48px] flex justify-between items-center bg-base-200 flex-row rounded-lg drop-shadow-lg">
      <input bind:value={searchTerm} type="text" placeholder="Search posts in this verse..." class="input input-ghost border-none w-4/5 h-[48px] m-0 text-white outline-none outline_none" />
  
      <div class="w-1/5 h-[48px] flex justify-end items-center m-0 px-5">
        <label for="archive-search" tabindex="0" class="cursor-pointer">
          <SearchIcon size="1.2x" class="icon_color" focusable="false" />
      </label>
      </div>
    </div>
    <!-- /Searchbar -->


    <!-- Posts -->
    <div class="w-full overflow-y-scroll h-[80vh] no_scrollbar flex flex-wrap flex-row">

      {#if searching}

        {#if emptyResults}

        <p class="text-center my-10 block mx-auto">Sorry, we couldn't find what you're looking for.</p>

        {:else}

          {#each searchResults as post}
          <PostCard {post} />
          {/each}

        {/if}

      {:else}

        {#if allPosts}

          {#each allPosts as post}
          <PostCard {post} {isOwnerOfVerse} />
          {/each}

        {/if}

      {/if}

    </div>
    <!-- /Posts -->


  </div>
  <!-- /Archive Of Posts -->


  <!-- Right Verse -->
  <div class="lg:hidden grid flex-grow lg:w-1/4 w-3/4 h-screen lg:h-auto top-0 z-50 lg:z-30 bg-base-100 {$openRightMobileNav ? 'right-0' : 'right-[-100%]'} lg:right-0 fixed overflow-y-auto p-10 lg:p-0 lg:static lg:drop-shadow-none border-l-2 border-base-300 lg:border-none ease-in-out duration-300">


    <!-- Verse Meta -->
    <VerseMeta />
    <!-- /Verse Meta -->


    <VerseUsers members={allMembers} {owner} />
  </div>
  <!-- /Right Verse -->


</div>
<!-- /Verse Container -->


<!-- Mobile Btm Nav -->
<MobileBtmNav page={'archive'} />
<!-- /Mobile Btm Nav -->


{/await}
