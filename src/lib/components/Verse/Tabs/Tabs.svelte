<script>
  import { currentTab } from "$lib/stores/Verse/tabs";
  import TabsNav from '$lib/components/Verse/Tabs/TabsNav.svelte';
  import PostsTab from '$lib/components/Verse/Tabs/PostsTab.svelte';
  import ChatTab from '$lib/components/Verse/Tabs/ChatTab.svelte';

  export let posts;
  export let chat;
  export let messages;
  export let isOwnerOfVerse;
</script>


<!-- Tabs Nav -->
<TabsNav />
<!-- /Tabs Nav -->


<!-- Tabs -->
<div class="overflow-y-scroll h-[80vh] no_scrollbar relative">
  {#if $currentTab == 0}

  <PostsTab {posts} {isOwnerOfVerse} />

  {:else if $currentTab == 1}

  <ChatTab {chat} {messages} />

  {/if}
</div>
<!-- /Tabs -->