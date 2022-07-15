<script>
    import { OptionsHorizontalIcon, HeartIcon, MessageAltIcon } from 'svelte-mono-icons';
    import { user } from "$lib/stores/user";
    import { supabase } from "$lib/utils/supabase";
    import { Circle } from "svelte-loading-spinners";
    import { addToast } from "$lib/stores/toastMsg";


    export let msg;

    // User is viewing their own messages
    const isOwnerOfMsg = $user.id == msg.owner.data.id;
</script>


{#if isOwnerOfMsg}


<!-- Msg Right -->
<div class="flex justify-end items-end flex-row ml-auto max-w-xs mb-5">

    <div class="flex justify-center items-end flex-col">
        <div class="bg-primary rounded-t-lg rounded-l-lg p-3 text-sm">{msg.text}</div>

        <a class="text-xs msg_owner font-semibold italic mt-2 mr-1" href="/profile/{msg.owner.data.username}">{msg.owner.data.username}</a>
    </div>

    <a href="/profile/{msg.owner.data.username}">
        <div tabindex="0" class="avatar cursor-pointer ml-3">
            <div class="w-6 rounded-full ring ring-primary ring-offset-base-50 ring-offset-1">
                <img class="w-full h-full object-center object-cover" src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{msg.owner.data.avatar_url}" alt="owner"/>
            </div>
        </div>
    </a>
</div>
<!-- /Msg Right -->


{:else}


<!-- Msg Left -->
<div class="flex justify-start items-end flex-row mr-auto max-w-xs mb-5">

    <a href="/profile/{msg.owner.data.username}">
        <div tabindex="0" class="avatar cursor-pointer mr-3">
            <div class="w-6 rounded-full ring ring-primary ring-offset-base-50 ring-offset-1">
                <img class="w-full h-full object-center object-cover" src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{msg.owner.data.avatar_url}" alt="owner"/>
            </div>
        </div>
    </a>

    <div class="flex justify-center items-start flex-col">
        <div class="bg-base-300 rounded-lg p-3 text-sm">{msg.text}</div>

        <a class="text-xs msg_owner font-semibold italic mt-2 ml-1" href="/profile/{msg.owner.data.username}">{msg.owner.data.username}</a>
    </div>
</div>
<!-- /Msg Left -->


{/if}


<style>
    .msg_owner {
        font-size: 10px;
    }
</style>



