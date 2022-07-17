<script context="module">
    import { supabase } from "$lib/utils/supabase";

    export async function load() {
    
        // Get the verse data with ssr from the url slug
        // Return the data as page props
        try {

            // Get verse data
            const { data:verses, error } = await supabase
                .from('verses')
                .select()
                .match({isPublic: true, isViewable: true})


            return { props: { verses } };

        } catch (err) {
            console.log('Error: ', err);
        }
    }
</script>

<script>
    import { SearchIcon } from 'svelte-mono-icons';
    import VerseCard from '$lib/components/Verse/VerseCard.svelte';
    import { mainPage } from "$lib/stores/mainPage";


    // Verse data from SSR
    export let verses;


    // This is to interchange between the chevron icon and the search bar in top nav
    // Search bar shows on a main page, and chevron shows on a 'sub' page to go back to the main page
    mainPage.set({
        isMainPage: true,
        mainPage: '/explore'
    });
</script>


<svelte:head>
    <title>Find your people.</title>
    <meta property="og:title" name="og:title" content="Find your people." />
    <meta property="description" name="description" content="Hryzn is a social platform where communities can connect through niche topics." />
    <meta property="og:description" name="og:description" content="Hryzn is a social platform where communities can connect through niche topics." />
</svelte:head>


<!-- Hero Container -->
<div class="h-[50vh] w-full lg:p-10 p-5 overflow-hidden">
    <div class="hero w-full h-full object-cover object-center rounded-box items-center justify-start relative" style="background-position: top; background-image: url('/img/site/cities/heroAnimations/Lake/Lake-day/Lake-day.svg');">
        
        
        <!-- Overlay -->
        <div class="hero-overlay bg-opacity-60 rounded-box absolute bg_overlay"></div>
        <!-- /Overlay -->


        <!-- Hero Text -->
        <div class="hero-content text-neutral-content w-full absolute">
            <div class="w-full lg:mx-12 mx-5">
                <p class="mb-10 lg:text-3xl text-2xl font-bold text-white w-full text-center">Find posts, join verses, and connect with your people.</p>

                <div class="lg:w-4/5 w-full mx-auto flex justify-center items-center bg-white flex-row rounded-lg drop-shadow-lg py-1">
                    <input type="text" placeholder="Search for anime...sports...makeup...memes...plants..." class="input bg-white border-none w-3/4 m-0 text-black outline_none" />
                
                    <div class="w-1/5 h-[48px] flex justify-end items-center m-0 px-5">
                        <label for="explore-search" tabindex="0" class="cursor-pointer">
                            <SearchIcon size="1.2x" class="icon_color" focusable="false" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <!-- /Hero Text -->


    </div>
</div>
<!-- /Hero Container -->


<!-- Verses Container -->
<div class="p-5 flex flex-wrap justify-center">


    {#each verses as verse}
    <div class="mb-5 sm:mx-5">
        <VerseCard {verse} />
    </div>
    {/each}


</div>
<!-- /Verses Container -->


<style>
    .outline_none {
        outline: none!important;
    }

    .bg_overlay {
        background-color: hsl(var(--n) / 0.3);
    }
</style>