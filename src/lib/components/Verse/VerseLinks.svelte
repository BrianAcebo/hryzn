<script>
    import { DropIcon, LayoutIcon, DocumentIcon } from 'svelte-mono-icons';
    import VerseInfo from '$lib/components/Verse/VerseInfo.svelte';
    import { currentVersePage } from "$lib/stores/Verse/currentVersePage";
    import { openLeftMobileNav } from "$lib/stores/openMobileNav";


    // Component props passed over
    export let verse;
    export let isOwnerOfVerse;
</script>


<div class="flex flex-col w-full px-5" on:click={() => { openLeftMobileNav.set(!$openLeftMobileNav) }}>
    <a class="text-xl mb-5 flex flex-row items-center {$currentVersePage == 'main' ? 'underline' : '' }" href="/v/{verse.slug}">
        <label for="v-links-main" tabindex="0">
            <DropIcon size="1x" class="icon_color mr-5" focusable="false" />
        </label>
        Main
    </a>


    <a class="text-xl mb-5 flex flex-row items-center" href="{verse.slug}#info">
        <label for="v-links-info" tabindex="0">
            <LayoutIcon size="1x" class="icon_color mr-5" focusable="false" />
        </label>
        Info
    </a>


    <a class="text-xl mb-5 flex flex-row items-center {$currentVersePage == 'archive' ? 'underline' : '' }" href="/v/archive/{verse.slug}">
        <label for="verseInfo" tabindex="0" class="">
            <DocumentIcon size="1x" class="icon_color mr-5" focusable="false" />
        </label>
        Archive
    </a>
</div>


<div class="modal" id="info">
    <div class="modal-box relative lg:p-10 p-24">

        <VerseInfo {verse} {isOwnerOfVerse} />

    </div>
</div>
