<script context="module">
  import { supabase } from "$lib/utils/supabase";


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


      // Get the pages data
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


      // Get main chat data
      const { data:mainChat } = await supabase
        .from('chat')
        .select()
        .match({verse_attached: verse.id, page_attached: 'main'})


      // Get main chat messages
      const { data:messages } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_attached', mainChat[0].id)

      let allMessages;
      if (messages && messages.length > 0) {
        allMessages = await Promise.all(messages.map(async (data) => {

          const msgOwner = await supabase
            .from('profiles')
            .select()
            .eq('id', data.owner)
            .single()

          return {
            id: data.id,
            owner: msgOwner,
            text: data.text,
            timestamp: data.timestamp
          }
        }));
      }


      // Get all posts
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
        pages,
        mainChat,
        allMessages,
        owner,
        allMembers,
        allPosts
      } };


    } catch (err) {
      console.log('Error: ', err);
    }
  }
</script>


<script>
  import Tabs from '$lib/components/Verse/Tabs/Tabs.svelte';
  import VerseNav from '$lib/components/Verse/VerseNav.svelte';
  import VerseMeta from '$lib/components/Verse/VerseMeta.svelte';
  import VerseUsers from '$lib/components/Verse/VerseUsers.svelte';
  import { currentVersePage } from "$lib/stores/Verse/currentVersePage";
  import { mainPage } from "$lib/stores/mainPage";
  import { user } from "$lib/stores/user";
  import MobileBtmNav from '$lib/components/Site/MobileBtmNav.svelte';
  import { openRightMobileNav } from "$lib/stores/openMobileNav";


  // This is to interchange between the chevron icon and the search bar in top nav
  // Search bar shows on a main page, and chevron shows on a 'sub' page to go back to the main page
  mainPage.set({
      isMainPage: false,
      mainPage: $mainPage.mainPage
  });


  // This is to change the underline for verse links
  currentVersePage.set('main')


  // Props data from SSR above
  export let verse;
  export let allPosts;
  export let mainChat;
  export let allMessages;
  export let owner;
  export let allMembers;
  export let pages;


  // Check if user is viewing their own verse
  const isOwnerOfVerse = $user.id == verse.owner;
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


  <!-- Center Verse -->
  <div class="lg:w-1/2 w-full">

    
    <!-- Verse Tabs -->
    <Tabs posts={allPosts} chat={mainChat} messages={allMessages} {isOwnerOfVerse}/>
    <!-- /Verse Tabs -->


  </div>
  <!-- /Center Verse -->


  <div class="divider lg:divider-horizontal lg:flex hidden"></div>


  <!-- Right Verse -->
  <div class="grid flex-grow lg:w-1/4 w-3/4 h-screen lg:h-auto top-0 z-50 lg:z-30 bg-base-100 {$openRightMobileNav ? 'right-0' : 'right-[-100%]'} lg:right-0 fixed overflow-y-auto p-10 lg:p-0 lg:static lg:drop-shadow-none border-l-2 border-base-300 lg:border-none ease-in-out duration-300">


    <!-- Verse Meta -->
    <VerseMeta />
    <!-- /Verse Meta -->


    <VerseUsers members={allMembers} {owner} />
  </div>
  <!-- /Right Verse -->


</div>
<!-- /Verse Container -->


<!-- Mobile Btm Nav -->
<MobileBtmNav page={'verse'} />
<!-- /Mobile Btm Nav -->


{/await}
