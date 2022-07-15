<script>
    import { mainPage } from "$lib/stores/mainPage";

    
    // This is to interchange between the chevron icon and the search bar in top nav
    // Search bar shows on a main page, and chevron shows on a 'sub' page to go back to the main page
    mainPage.set({
        isMainPage: false,
        mainPage: $mainPage.mainPage
    });
</script>


<svelte:head>
    <title>Page Not Found</title>
</svelte:head>


<div class="hero min-h-screen" style="background-position: center; background-image: url('/img/site/cities/heroAnimations/Sea Ship/Seaship-night/Seaship-night.svg');">
    <div class="hero-content text-center">
        <div class="max-w-xl">
            <h1 class="text-5xl font-bold text-white">Whoops, a 404...</h1>

            <p class="py-6 text-white">That means none of our robots were able to find the page you're looking for, not even the smart ones...</p>

            <a href="{$mainPage.mainPage}" class="btn btn-primary">Go Back</a>
        </div>
    </div>
</div>