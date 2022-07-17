<script>
    import { BarChartAltIcon, UsersIcon, UserIcon, BookIcon } from 'svelte-mono-icons';
    import { openLeftMobileNav, openRightMobileNav } from "$lib/stores/openMobileNav";

    export let page;
</script>


<div class="w-full fixed flex flex-row z-50 p-3 bottom-0 bg-base-100 border-t-2 border-base-300 lg:hidden">
    <div class="w-1/2 flex justify-end items-center px-10">
        <button class="btn btn-outline p-1" on:click={() => { openLeftMobileNav.set(!$openLeftMobileNav); openRightMobileNav.set(false) }}>
            <label for="btm-nav-left" tabindex="0" class="text-xs cursor-pointer">
                {#if page == 'verse'}
                <BarChartAltIcon size="1.5x" class="icon_color text-xs" focusable="false" />
                {:else}
                <UserIcon size="1.5x" class="icon_color text-xs" focusable="false" />
                {/if}
            </label>
        </button>
    </div>

    
    <div class="w-1/2 flex justify-start items-center px-10">
        <button class="btn btn-outline p-1" on:click={() => { openRightMobileNav.set(!$openRightMobileNav); openLeftMobileNav.set(false)}}>
            <label for="btm-nav-right" tabindex="0" class="text-xs cursor-pointer">
                {#if page == 'verse'}
                <UsersIcon size="1.5x" class="icon_color text-xs" focusable="false" />
                {:else}
                <BookIcon size="1.5x" class="icon_color text-xs" focusable="false" />
                {/if}
            </label>
        </button>
    </div>
</div>