<script>
    import Icon from 'svelte-awesome';
    import plus from 'svelte-awesome/icons/plus';
    import exclamationCircle from 'svelte-awesome/icons/exclamationCircle';
    import { Circle } from "svelte-loading-spinners";
    import { checkPageName } from "$lib/utils/verse/verseUtils";
    import { addToast } from "$lib/stores/toastMsg";
    import { goto } from '$app/navigation';
    import { supabase } from "$lib/utils/supabase";
    import { user } from "$lib/stores/user";
    import { currentVersePage } from "$lib/stores/Verse/currentVersePage";


    // Component props passed over
    export let verse;
    export let pages;
    const isOwnerOfVerse = false; // Hard code to false for now
    //export let isOwnerOfVerse;


    // Verse pages variables
    let pageName;
    let isReadOnly = false;
    let formError;
    let formErrorMsg;
    let loading;


    // Cancel page create
    const cancelPage = () => {
        pageName = '';
        formError = false;
        formErrorMsg = '';
    }


    // On submit insert page
    const submitPage = async () => {


        // Info to be validated
        const info = {
            name: pageName,
        }


        // Validate
        const data = await checkPageName(info);


        // If no errors
        if (!data.error) {


            try {


                loading = true;


                // Insert page into db
                const { data:versePage, error } = await supabase.from('pages').insert([{
                    name: data.name, 
                    verse_attached: verse.id,
                    owner: $user.id,
                    isReadOnly
                }]);


                // Create a chat for new page
                await supabase.from('chat').insert({
                    verse_attached: verse.id,
                    page_attached: versePage[0].id,
                    owner: $user.id
                });


                if (error) throw error;


                // Notify page was created
                addToast({
                    message: "Page Created",
                    type: "success",
                    dismissible: false,
                    timeout: 3000,
                });


                // Redirect back to page to reload the browser
                goto(`/p/${versePage[0].id}`);


            } catch (error) {


                // There was an error
                addToast({
                    message: error.message,
                    type: "error",
                    dismissible: false,
                    timeout: 3000,
                });


            } finally {
                loading = false;
            }


        } else {


            // There was an error
            formError = true;
            formErrorMsg = data.msg;
            

        }
    }
</script>


<!-- Verse Pages Container -->
<div class="flex flex-col w-full px-5">
    <div class="flex flex-row justify-between items-center mb-3">
        <h3>Pages</h3>

        {#if isOwnerOfVerse}
        <label tabindex="0" for="verse-pages-modal" class="btn modal-button">
            <Icon data={plus} />
        </label>
        {/if}
    </div>


    {#if pages}
        {#each pages as page}
        <a class="text-sm mb-3 ml-5 {$currentVersePage == page.id ? 'underline' : '' }" href="/p/{page.id}">/{page.name}</a>
        {/each}
    {/if}
</div>
<!-- /Verse Pages Container -->


<!-- Create Page Modal -->
<input type="checkbox" id="verse-pages-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box pt-12">
    <label for="verse-pages-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

    {#if loading}

    <Circle size="60" color="icon_color" unit="px"></Circle>

    {:else}

    <form on:submit|preventDefault={submitPage}>

        {#if formError}
        <div class="alert shadow-lg alert-error mb-5">
            <div class="text-center">
                <Icon data={exclamationCircle} />
                <span class="text-xs text-center">{formErrorMsg}</span>
            </div>
        </div>
        {/if}

        <input bind:value={pageName} on:input={() => formError = false} type="text" placeholder="Give the page a name" class="{formError ? 'input-error' : ''} input input-bordered w-full mb-5" required />

        <div class="form-control bg-base-300 p-5 rounded-lg mb-5">
            <div class="flex justify-center items-center flex-row w-full">
            <label for="page-create" class="p-5 label cursor-pointer mx-2 badge {isReadOnly ? 'badge-ghost' : 'badge-secondary'}" on:click={() => isReadOnly = false}>
                <span class="label-text mr-2">User Ability</span>
                <input type="radio" name="radio-6" class="radio checked:bg-blue-500" checked />
            </label>

            <label for="page-create" class="p-5 label cursor-pointer mx-2 badge {isReadOnly ? 'badge-secondary' : 'badge-ghost'}" on:click={() => isReadOnly = true}>
                <span class="label-text mr-2">Read Only</span>
                <input type="radio" name="radio-6" class="radio checked:bg-blue-500" />
            </label>
            </div>

            <p class="mt-5 text-xs text-center">
            {#if isReadOnly}
            Regular members can post and chat.
            {:else}
            Regular members can only read info you post.
            {/if}
            </p>
        </div>

        <div class="flex justify-between items-center">
            <button type="submit" class="btn btn-primary w-[48%]">Save</button>
            <label for="verse-pages-modal" on:click={cancelPage} type="button" class="btn btn-error btn-outline w-[48%]">Cancel</label>
        </div>

    </form>

    {/if}
  </div>
</div>
<!-- /Create Page Modal -->