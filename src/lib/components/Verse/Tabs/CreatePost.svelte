<script>
    import { ImageIcon, WebcamIcon, ScaleIcon, MinimizeIcon, CircleWarningIcon } from 'svelte-mono-icons';
    import { Circle } from "svelte-loading-spinners";
    import { longerPost } from "$lib/stores/Verse/longerPost";
    import { checkPost } from "$lib/utils/verse/verseUtils";
    import { addToast } from "$lib/stores/toastMsg";
    import { user } from "$lib/stores/user";
    import { supabase } from "$lib/utils/supabase";
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';


    export let placeholder;


    // Post variables
    let formError;
    let formErrorMsg;
    let loading;
    let filePath;
    let containsMedia = false;


    // Create a preview of image on upload
    let imageInput;
    let previewImage1;
    let previewImage2;
    let previewImage3;
	let showImagePreview = false;
    let amountOfImages;
    let imageFiles = [];

    const uploadImage = async () => {


        // If there was a video before, we're conceling it out
        videoInput.value = '';
        showVideoPreview = false;
        amountOfImages = 0;


        // Make sure there's files and no more than 3
        if (imageInput.files && imageInput.files.length < 4) {


            // Iterate and check each file
            for (let i = 0; i < imageInput.files.length; i++) {


                let file = imageInput.files[i];


                amountOfImages++;


                // Allowed file types
                const allowedFileExt = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

                
                // If it's not an allowed file type
                if (!allowedFileExt.exec(file.name)) {


                    // Notify the user there was an error
                    formError = true;
                    formErrorMsg = 'Only jpg, jpeg, png, and gif file types are allowed.'
                    imageInput.value = '';


                    // Reset variables
                    containsMedia = false;
                    showImagePreview = false;


                    return false;


                } else {


                    // Show preview and reset error variables
                    formError = false;
                    formErrorMsg = '';
                    showImagePreview = true;


                    // Give src attribute to image preview element
                    const reader = new FileReader();
                    reader.addEventListener("load", function () {
                        if (i == 0) {
                            previewImage1.setAttribute("src", reader.result);
                        } else if (i == 1) {
                            previewImage2.setAttribute("src", reader.result);
                        } else {
                            previewImage3.setAttribute("src", reader.result);
                        }
                    });
                    reader.readAsDataURL(file);


                    // Give the file a new name
                    const fileExt = file.name.split('.').pop();
                    const randomName = `${Math.random()}.${fileExt}`;
                    const fileName = randomName.substring(randomName.indexOf('0.') + 2);
                    filePath = `${fileName}`;


                    // Upload the file to storage
                    await supabase.storage.from('avatars').upload(filePath, file);


                    // Set variables to be ready to use on submit
                    imageFiles.push(filePath)
                    containsMedia = true;


                    // Finish the for loop
                    if (amountOfImages == imageInput.files.length) return;


                }
            }


        } else {


            // Notify the user there was an error
            formError = true;
            formErrorMsg = 'Maximum of 3 images allowed.'
            imageInput.value = '';


            showImagePreview = false;


            return false;


        }
    }


    // Create a preview of video on upload
    let videoInput;
    let previewVideo;
    let showVideoPreview = false;
    let videoUrl;

    const uploadVideo = async () => {


        // If there were images before, we're conceling it out
        let file = videoInput.files[0];
        imageInput.value = '';
        showImagePreview = false;


        // Allowed file types
        const allowedFileExt = /(\.mp4|\.ogg|\.webm)$/i;


        // Make sure there was a file
        if (file) {


            // If it's not an allowed file type
            if (!allowedFileExt.exec(file.name)) {


                // Notify the user there was an error
                formError = true;
                formErrorMsg = 'Only mp4, ogg, and webm file types are allowed.'
                videoInput.value = '';


                // Reset variables
                containsMedia = false;
                showVideoPreview = false;


                return false;


            } else {


                // Show preview and reset error variables
                formError = false;
                formErrorMsg = '';
                showVideoPreview = true;


                // Give src attribute to video preview element
                (async () => {
                    let blobURL = await URL.createObjectURL(file);
                    previewVideo.src = blobURL;
                })();


                // Give the file a new name
                const fileExt = file.name.split('.').pop();
                const randomName = `${Math.random()}.${fileExt}`;
                const fileName = randomName.substring(randomName.indexOf('0.') + 2);
                videoUrl = `${fileName}`;


                // Set variables to be ready to use on submit
                containsMedia = true;


                // Upload the file to storage
                await supabase.storage.from('avatars').upload(videoUrl, file);


                return;


            }
        }
    }


    // Submit post
    let postText;

    const submitPost = async () => {


        console.log(containsMedia)


        // Object to be checked
        const info = {
            text: postText,
            containsMedia
        }


        // Validation
        const data = await checkPost(info);


        // If no validation errors
        if (!data.error) {


            try {


                loading = true;


                // Get the current page so the post can be placed in the correct page of verse i.e. 'main' or 'helpdesk'
                let currentPage = $page.params.slug;
                currentPage = currentPage.substring(currentPage.indexOf('-HSL0') + 5);
                let page_attached = currentPage.indexOf('/') == 1;


                // Insert into db
                const { data, error } = await supabase.from('posts').insert([{
                    owner: $user.id,
                    text: postText,
                    image_urls: imageFiles,
                    video_url: videoUrl,
                    verse_attached: currentPage,
                    page_attached: page_attached
                }]);
                

                if (error) throw error;


                // Reset variables
                if (videoInput) videoInput.value = '';
                containsMedia = false;
                showVideoPreview = false;
                if (imageInput) imageInput.value = '';
                showImagePreview = false;
                if (postText) postText = '';


                // Notify the user it was posted
                addToast({
                    message: "Posted",
                    type: "success",
                    dismissible: false,
                    timeout: 3000,
                });


                // Redirect to the same page for reload
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


<!-- Exit btn -->
<label for="create-post" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
<!-- /Exit btn -->


<!-- Create Post Container -->
<div class="p-3">


    {#if loading}


    <Circle size="60" color="icon_color" unit="px"></Circle>


    {:else}


    <!-- Form -->
    <form on:submit|preventDefault={submitPost}>


        <!-- Error -->
        {#if formError}
        <div class="alert shadow-lg alert-error mb-5">
            <div class="text-center">
                <CircleWarningIcon size="1x" class="icon_color" focusable="false" />
                <span class="text-xs text-center">{formErrorMsg}</span>
            </div>
        </div>
        {/if}
        <!-- /Error -->


        <!-- Text Area -->
        <textarea bind:value={postText} class="bg-transparent outline_none font-small text-lg w-full {$longerPost ? 'h-[60vh]': ''}" rows="3" cols="50" placeholder="{placeholder}"></textarea>
        <!-- /Text Area -->


        <!-- Image Preview -->
        {#if showImagePreview && !showVideoPreview}

        {#if amountOfImages == 1}
        <div class="my-5 h-[100px] overflow-hidden rounded-lg">
            <img class="w-full h-full object-center object-cover mx-auto rounded-lg" bind:this={previewImage1} src="" alt="Preview" />
        </div>
        {:else if amountOfImages == 2}
        <div class="my-5 flex w-full h-[100px] overflow-hidden justify-center items-center flex-row rounded-lg">
            <div class="w-1/2 h-full border-r-4 border-r-white">
                <img class="w-full h-full object-center object-cover" bind:this={previewImage1} src="" alt="Preview" />
            </div>

            <div class="w-1/2 h-full">
                <img class="w-full h-full object-center object-cover" bind:this={previewImage2} src="" alt="Preview" />
            </div>
        </div>
        {:else}
        <div class="my-5 flex w-full h-[150px] overflow-hidden justify-center items-center flex-row rounded-lg">
            <div class="w-1/2 h-full border-r-4 border-r-white">
                <img class="w-full h-full object-center object-cover" bind:this={previewImage1} src="" alt="Preview" />
            </div>

            <div class="flex justify-center items-center flex-col w-1/2 h-full">
                <img class="w-full h-full object-center object-cover border-b-4 border-b-white" bind:this={previewImage2} src="" alt="Preview" />
                <img class="w-full h-full object-center object-cover" bind:this={previewImage3} src="" alt="Preview" />
            </div>
        </div>
        {/if}

        {/if}
        <!-- /Image Preview -->


        <!-- Video Preview -->
        {#if showVideoPreview && !showImagePreview}
        <video class="w-full max-w-md mx-auto my-5" controls bind:this={previewVideo}>
            Your browser does not support the video tag.
            <track kind="captions">
        </video>
        {/if}
        <!-- /Video Preview -->



        <!-- Create Post Btns -->
        <div class="flex w-full justify-between items-center">
            <div class="flex items-center">
                <div class="text-center mr-3">
                    <label for="postImage" tabindex="0" class="cursor-pointer btn btn-ghost group flex items-center justify-center p-3 text-base font-medium rounded-full">
                        <ImageIcon size="1.2x" class="icon_color" focusable="false" />
                    </label>
                    <input id="postImage" bind:this={imageInput} on:change={uploadImage} class="hidden" type="file" accept=".jpg, .jpeg, .png, .gif" multiple>
                </div>

                <div class="text-center mr-3">
                    <label for="postVideo" tabindex="0" class="cursor-pointer btn btn-ghost group flex items-center justify-center p-3 text-base font-medium rounded-full">
                        <WebcamIcon size="1.2x" class="icon_color" focusable="false" />
                    </label>
                    <input id="postVideo" bind:this={videoInput} on:change={uploadVideo} class="hidden" type="file" accept=".mp4, .ogg, .webm">
                </div>

                <div class="text-center">
                    <div on:click={() => longerPost.set(!$longerPost)} class="btn btn-ghost group flex items-center justify-center p-3 text-base font-medium rounded-full">
                        <label for="post-long" tabindex="0" class="cursor-pointer">
                            {#if $longerPost == true}
                            <MinimizeIcon size="1.2x" class="icon_color" focusable="false" />
                            {:else}
                            <ScaleIcon size="1.2x" class="icon_color" focusable="false" />
                            {/if}
                        </label>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary text-white font-bold py-1 px-6 rounded-full float-right text-xs">
                Post
            </button>
        </div>
        <!-- /Create Post Btns -->


    </form>
    <!-- /Form -->


    {/if}


</div>
<!-- /Create Post Container -->