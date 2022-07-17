<script>
    import Icon from 'svelte-awesome';
    import barChart from 'svelte-awesome/icons/barChart';
    import users from 'svelte-awesome/icons/users';
    import user from 'svelte-awesome/icons/user';
    import book from 'svelte-awesome/icons/book';
    import { openLeftMobileNav, openRightMobileNav } from "$lib/stores/openMobileNav";

    export let page;
</script>


<div class="w-full fixed flex flex-row z-50 p-3 bottom-0 bg-base-100 border-t-2 border-base-300 lg:hidden">
    <div class="w-1/2 flex justify-end items-center px-10">
        <button class="btn btn-outline p-1" on:click={() => { openLeftMobileNav.set(!$openLeftMobileNav); openRightMobileNav.set(false) }}>
            <label for="btm-nav-left" tabindex="0" class="text-xs cursor-pointer">
                {#if page == 'verse'}
                <Icon data={barChart} scale="1.5"/>
                {:else}
                <Icon data={user} scale="1.5"/>
                {/if}
            </label>
        </button>
    </div>

    
    <div class="w-1/2 flex justify-start items-center px-10">
        <button class="btn btn-outline p-1" on:click={() => { openRightMobileNav.set(!$openRightMobileNav); openLeftMobileNav.set(false)}}>
            <label for="btm-nav-right" tabindex="0" class="text-xs cursor-pointer">
                {#if page == 'verse'}
                <Icon data={users} scale="1.5"/>
                {:else}
                <Icon data={book} scale="1.5"/>
                {/if}
            </label>
        </button>
    </div>
</div>