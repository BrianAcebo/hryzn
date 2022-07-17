<script>
    import MsgCard from "$lib/components/Verse/MsgCard.svelte";
    import { Circle } from "svelte-loading-spinners";
    import Icon from 'svelte-awesome';
    import exclamationCircle from 'svelte-awesome/icons/exclamationCircle';
    import longArrowUp from 'svelte-awesome/icons/longArrowUp';
    import { addToast } from "$lib/stores/toastMsg";
    import { user } from "$lib/stores/user";
    import { supabase } from "$lib/utils/supabase";
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { checkMsg } from "$lib/utils/verse/verseUtils";


    // Component props passed down
    export let chat;
    export let messages;


    // Chat variables
    let msg;
    let loading;
    let formError;
    let formErrorMsg;


    // Submit chat message
    const submitMsg = async () => {


        // Object to be checked
        const info = {
            text: msg
        }


        // Validation
        const data = await checkMsg(info);


        // If there were no validation errors
        if (!data.error) {


            try {


                loading = true;


                // Insert msg into db
                const { data, error } = await supabase.from('messages').insert([{
                    owner: $user.id,
                    text: msg,
                    chat_attached: chat[0].id
                }]);
                

                if (error) throw error;


                // Reset msg variable
                msg = '';


                // Notify the user message was sent
                addToast({
                    message: "Message Sent",
                    type: "success",
                    dismissible: false,
                    timeout: 3000,
                });


                // Redirect back to page to reload
                goto('/v/' + $page.params.slug);


            } catch (error) {


                // Notify the user there was an error
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


            // Notify the user there was an error
            formError = true;
            formErrorMsg = data.msg;


        }
    }
</script>


{#if messages}

<div class="px-5 flex flex-col">
    {#each messages as msg}
    <MsgCard {msg} />
    {/each}
</div>

{:else}

<h3 class="text-center mt-12">No messages yet.</h3>

{/if}


<form on:submit|preventDefault={submitMsg}>
    <div class="form-control w-full absolute bottom-24">
        {#if loading}


        <Circle size="60" color="icon_color" unit="px"></Circle>


        {:else}

        
        <!-- Error -->
        {#if formError}
        <div class="alert shadow-lg alert-error mb-5">
            <div class="text-center">
                <Icon data={exclamationCircle} />
                <span class="text-xs text-center">{formErrorMsg}</span>
            </div>
        </div>
        {/if}
        <!-- /Error -->


        <!-- Chat text input -->
        <label for="chat-text" class="input-group input-group-lg rounded-lg drop-shadow-lg">
            <textarea bind:value={msg} class="textarea outline_none bg-base-200 w-[90%] py-5 h-16 no_scrollbar" placeholder="Type Something Nice..."></textarea>
            <button type="submit" class="w-[10%] cursor-pointer flex justify-center items-center btn btn-circle h-16 border-none">
                <label for="chat-send" tabindex="0">
                    <Icon data={longArrowUp} />
                </label>
            </button>
        </label>
        <!-- /Chat text input -->


        {/if}
    </div>
</form>