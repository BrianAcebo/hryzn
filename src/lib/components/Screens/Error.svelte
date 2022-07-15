<script>
    import { mainPage } from "$lib/stores/mainPage";
    import { dev } from '$app/env'; // If in development mode show error msg


    // This is to interchange between the chevron icon and the search bar in top nav
    // Search bar shows on a main page, and chevron shows on a 'sub' page to go back to the main page
    mainPage.set({
        isMainPage: false,
        mainPage: $mainPage.mainPage
    });


    export let message; // error msg prop
    export let status; // error status prop
</script>


<svelte:head>
    <title>Oops, there's an error</title>
</svelte:head>


<div class="hero min-h-screen" style="background-position: center; background-image: url('/img/site/cities/heroAnimations/Snow/Snow-sunset/Snow-sunset.svg');">
    <div class="hero-content text-center">
        <div class="max-w-xl">
            <h1 class="text-5xl font-bold text-white">{status}</h1>

            {#if !dev}
            <p class="py-6 text-white">There seems to have been an error...</p>
            {:else}
            <p class="py-6 text-white">{message}</p>
            {/if}

            <a href="{$mainPage.mainPage}" class="btn btn-primary">Go Back</a>
        </div>
    </div>
</div>