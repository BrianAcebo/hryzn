<script>
    import Icon from 'svelte-awesome';
    import tint from 'svelte-awesome/icons/tint';
    import archive from 'svelte-awesome/icons/archive';	
    import list from 'svelte-awesome/icons/list';	
    import VerseInfo from '$lib/components/Verse/VerseInfo.svelte';
    import { currentVersePage } from "$lib/stores/Verse/currentVersePage";
    import { openLeftMobileNav } from "$lib/stores/openMobileNav";


    // Component props passed over
    export let verse;
    export let isOwnerOfVerse;
</script>


<div class="flex flex-col w-full px-5" on:click={() => { openLeftMobileNav.set(!$openLeftMobileNav) }}>
    <a class="text-xl mb-5 flex flex-row items-center {$currentVersePage == 'main' ? 'underline' : '' }" href="/v/{verse.slug}">
        <Icon for="verse-pages-modal" data={tint} class="mr-5" scale="1.5" />
        Main
    </a>


    <div class="text-xl mb-5 flex flex-row items-center cursor-pointer">
        <Icon for="verse-pages-modal" data={list} class="mr-5" scale="1.5" />
        <label for="v-info">Info</label>
    </div>


    <a class="text-xl mb-5 flex flex-row items-center {$currentVersePage == 'archive' ? 'underline' : '' }" href="/v/archive/{verse.slug}">
        <Icon for="verse-pages-modal" data={archive} class="mr-5" scale="1.5" />
        Archive
    </a>
</div>


<input type="checkbox" id="v-info" class="modal-toggle" />
<div class="modal" id="v-info">
    <div class="modal-box relative lg:p-10 p-24">

        <VerseInfo {verse} {isOwnerOfVerse} />

    </div>
</div>
