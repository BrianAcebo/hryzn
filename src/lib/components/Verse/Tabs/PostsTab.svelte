<script>
    import PostCard from "$lib/components/Verse/PostCard.svelte";

    export let posts;
    export let isOwnerOfVerse;
</script>


{#if posts}

    {#each posts as post}

    <PostCard {post} {isOwnerOfVerse} />

    {/each}

{:else}

<h3 class="text-center mt-12">No posts yet.</h3>

{/if}