<script>
    import { OptionsHorizontalIcon, HeartIcon, MessageAltIcon } from 'svelte-mono-icons';
    import { user } from "$lib/stores/user";
    import { supabase } from "$lib/utils/supabase";
    import { Circle } from "svelte-loading-spinners";
    import { addToast } from "$lib/stores/toastMsg";
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import ImgCard from "$lib/components/Verse/ImgCard.svelte";


    // Component props passed over
    export let post;
    export let isOwnerOfVerse;


    // User is viewing their own post
    const isOwnerOfPost = $user.id == post.owner.data.id;


    let loading = false;


    // Delete the post
    const deletePost = async () => {


        // Can only delete the post if is owner of the verse or owner of the post
        if (isOwnerOfVerse || isOwnerOfPost) {


            try {


                loading = true;


                // Delete post from db
                const { error } = await supabase
                    .from('posts')
                    .delete()
                    .match({ id: post.id })


                if (error) throw error;


                // Notify the user it was deleted
                addToast({
                    message: "Deleted",
                    type: "success",
                    dismissible: false,
                    timeout: 3000,
                });


                // Redirect back to page to reload the browser
                goto($page.url.pathname);


            } catch (error) {


                // Notify there was an error
                addToast({
                    message: error.message,
                    type: "error",
                    dismissible: false,
                    timeout: 3000,
                });


            } finally {
                loading = false;
            }


        }


    }
</script>


<!-- Post Container -->
<div class="bg-base-300 w-10/12 p-8 relative rounded-box mb-5 mx-auto my-10 max-w-md {(post.image_urls && post.image_urls.length > 0) || post.video_url  ? '' : 'max-h-64'}">


    <!-- Post User -->
    <a href="/profile/{post.owner.data.username}" class="text-sm flex flex-row mb-5">
        <div class="w-5 h-5 rounded-full ring ring-primary ring-offset-base-50 ring-offset-1 overflow-hidden mr-3">
        <img class="w-full h-full object-center object-cover" src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{post.owner.data.avatar_url}" />
        </div>
        @{post.owner.data.username}
    </a>
    <!-- Post User -->


    <!-- Post Text -->
    {#if post.text}
    <p class="my-5 block">{post.text}</p>
    {/if}
    <!-- Post Text -->


    <!-- Post Images -->
    {#if post.image_urls && post.image_urls.length > 0}


    <label for="img-modal-{post.id}" class="cursor-pointer">
        {#if post.image_urls.length == 1}

        <div class="my-5 h-[175px] overflow-hidden rounded-lg">
            <ImgCard image_url={post.image_urls[0]} />
        </div>

        {:else if post.image_urls.length == 2}

        <div class="my-5 flex w-full h-[175px] overflow-hidden justify-center items-center flex-row rounded-lg">
            <div class="w-1/2 h-full border-r-4 border-r-secondary">
                <ImgCard image_url={post.image_urls[0]}/>
            </div>

            <div class="w-1/2 h-full">
                <ImgCard image_url={post.image_urls[1]} />
            </div>
        </div>

        {:else}

        <div class="my-5 flex w-full h-[175px] overflow-hidden justify-center items-center flex-row rounded-lg">
            <div class="w-1/2 h-full border-r-4 border-r-secondary">
                <ImgCard image_url={post.image_urls[0]} />
            </div>

            <div class="flex justify-center items-center flex-col w-1/2 h-full">
                <ImgCard image_url={post.image_urls[1]} />
                <hr class="w-full border-t-4 border-secondary" />
                <ImgCard image_url={post.image_urls[2]} />
            </div>
        </div>

        {/if}
    </label>


    {/if}
    <!-- /Post Images -->


    <!-- Post Video -->
    {#if post.video_url}
    <video class="w-full lg:h-56 h-48 max-w-lg mx-auto ounded-box overflow-hidden my-5" controls src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{post.video_url}">
        Your browser does not support the video tag.
        <track kind="captions">
    </video>
    {/if}
    <!-- Post Video -->


    <!-- Post Btns -->
    <div class="flex flex-row items-center justify-end mt-5 absolute right-6 bottom-6">
        <!-- <div class="flex flex-row items-center">
            <label tabindex="0" class="text-xs cursor-pointer">
                <HeartIcon size="1.5x" class="icon_color text-xs mr-5" focusable="false" />
            </label>

            <label tabindex="0" class="text-xs cursor-pointer">
                <MessageAltIcon size="1.5x" class="icon_color text-xs" focusable="false" />
            </label>
        </div> -->

        <div class="dropdown dropdown-end">
            <label tabindex="0" class="text-xs cursor-pointer">
            <OptionsHorizontalIcon size="1.5x" class="icon_color text-xs" focusable="false" />
            </label>

            <div tabindex="0" class="card compact dropdown-content shadow bg-base-100 rounded-box">
                <div class="card-body">
                    {#if isOwnerOfVerse || isOwnerOfPost}
                    <label for="delete-post-{post.id}" class="mb-5 text-xs cursor-pointer">Delete</label>
                    {/if}
                    <p class="text-xs cursor-pointer">Report</p>
                </div>
            </div>
        </div>
    </div>
    <!-- /Post Btns -->


    <!-- Verse Name -->
    {#if post.verse && post.verse.data.name}
    <a href="/v/{post.verse.data.slug}" class="text-2xs font-semibold italic">{post.verse.data.name}</a>
    {/if}
    <!-- /Verse Name -->


    <!-- Modal For Post Images -->
    {#if post.image_urls && post.image_urls.length > 0}
    <input type="checkbox" id="img-modal-{post.id}" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box lg:h-[75vh] lg:w-[50%] w-full h-[50vh] max-w-3xl">
            <label for="img-modal-{post.id}" class="btn btn-sm btn-circle absolute right-2 top-2 z-10">✕</label>
            <div class="carousel w-full h-full">
                {#if post.image_urls.length > 1}
                {#each post.image_urls as img, i}
                <div id="slide{i}-{post.id}" class="carousel-item relative w-full z-0">
                    <ImgCard image_url={img} />

                  <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    {#if i > 0}
                    <a href="#slide{i == 0 ? i : i - 1}-{post.id}" class="btn btn-circle mr-auto">❮</a> 
                    {/if}

                    {#if i < post.image_urls.length - 1}
                    <a href="#slide{i + 1}-{post.id}" class="btn btn-circle ml-auto">❯</a>
                    {/if}
                  </div>
                </div> 
                {/each}
                {:else}
                <div class="carousel-item relative w-full z-0">
                    <ImgCard image_url={post.image_urls[0]} />
                </div> 
                {/if}
              </div>
        </div>
    </div>
    {/if}
    <!-- /Modal For Post Images -->


    <!-- Delete post modal -->
    <input type="checkbox" id="delete-post-{post.id}" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box">
            {#if loading}

            <Circle size="60" color="icon_color" unit="px"></Circle>

            {:else}
            <h3 class="font-bold text-lg text-center">Are you sure?</h3>

            <div class="modal-action justify-center">
                <button for="delete-post-{post.id}" on:click={deletePost} class="btn btn-ghost mr-10 capitalize">Yes, I'm Sure</button>
                <label for="delete-post-{post.id}" class="btn">Cancel</label>
            </div>
            {/if}
        </div>
    </div>
    <!-- /Delete post modal -->


</div>
<!-- /Post Container -->