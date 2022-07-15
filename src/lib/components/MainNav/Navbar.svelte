<script>
  import TopNav from './TopNav.svelte';
  import MobileNav from './MobileNav.svelte';
  import { media } from "$lib/cssHelpers/MediaQuery";
  import { user } from "$lib/stores/user";
</script>

{#if $media.medium}
  {#if $user}
  <MobileNav />
  {:else}
  <TopNav />
  {/if}
{:else}
  <TopNav />
{/if}
