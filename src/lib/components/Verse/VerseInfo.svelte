<script>
    import { PenIcon, CloseIcon, CircleWarningIcon } from 'svelte-mono-icons';
    import { Circle } from "svelte-loading-spinners";
    import { user } from "$lib/stores/user";
    import { checkVerseInfo } from "$lib/utils/verse/verseUtils";
    import { addToast } from "$lib/stores/toastMsg";
    import { supabase } from "$lib/utils/supabase";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';


    // Component props passed over
    export let verse;
    export let isOwnerOfVerse;


    // Verse info variables
    let showEdit = false;
    let verseName = verse.name;
    let verseDescription = verse.description;
    let formError;
    let formErrorMsg;
    let loading;
    let file;
    let filePath;


    // Image url from supabase storage
    let image_url;
    onMount(async () => {
        const { data, error } = supabase.storage.from('avatars').getPublicUrl(verse.image_url);
        image_url = data.publicURL;
    });
    

    // Create a preview of image on upload
    let imageInput;
    let previewImage;
	let showImagePreview = false;

    const uploadImage = () => {


        file = imageInput.files[0];


        // Allowed file types
        const allowedFileExt = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

        
        // Make sure there was a file submitted
        if (file) {


            // Check to see if it's an allowed file type
            if (!allowedFileExt.exec(file.name)) {


                formError = true;
                formErrorMsg = 'Only jpg, jpeg, png, and gif file types are allowed.'
                imageInput.value = '';


                showImagePreview = false;


                return false;


            } else {


                formError = false;
                formErrorMsg = '';
                showEdit = true;
                showImagePreview = true;


                // Give src attribute to image preview element
                const reader = new FileReader();
                reader.addEventListener("load", function () {
                    previewImage.setAttribute("src", reader.result);
                });
                reader.readAsDataURL(file);


                // Create a new name for the file
                const fileExt = file.name.split('.').pop();
                const randomName = `${Math.random()}.${fileExt}`;
                const fileName = randomName.substring(randomName.indexOf('0.') + 2);
                filePath = `${fileName}`;


                return;


            }
        }
    }


    // Hide save / cancel buttons and reset inputs
    const cancelEdit = () => {
        showEdit = false; 
        verseName = verse.name; 
        verseDescription = verse.description;
        if (imageInput) imageInput.value = '';
        showImagePreview = false;
        formError = false;
        formErrorMsg = '';
    }


    // On submit update verse
    const updateVerse = async () => {


        // Object to be validated
        const info = {
            name: verseName,
            description: verseDescription,
            slug: ''
        }


        // Validation
        const data = await checkVerseInfo(info);


        // If there were no validation errors
        if (!data.error) {


            try {


                loading = true;


                // Create a new slug for the verse with the data given back from validation
                const slug = data.slug + verse.slug.substring(verse.slug.indexOf('-HSL0'));


                // Update the verse in the db 
                let { error } = await supabase.from('verses').update({ 
                    name: data.name, 
                    description: data.description,
                    slug: slug,
                    image_url: filePath
                }).match({ id: verse.id });


                // Remove the old image and upload the new image to storage
                await supabase.storage.from('avatars').remove([`${verse.image_url}`])

                let { uploadError } = await supabase.storage.from('avatars').upload(filePath, file);


                if (error || uploadError) throw error;


                // Notify the user changes were saved
                addToast({
                    message: "Changes Saved",
                    type: "success",
                    dismissible: false,
                    timeout: 3000,
                });


                // Redirect back to page to reload the browser
                goto('/v/' + slug);


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


        } else {

            // Notify there was a validation error
            formError = true;
            formErrorMsg = data.msg;

    
        }
    }
</script>


{#if loading}


    <Circle size="60" color="icon_color" unit="px"></Circle>


    {:else}


        {#if isOwnerOfVerse}


        <!-- Verse Info Form -->
        <form on:submit|preventDefault={updateVerse}>


            <!-- Error Msg -->
            {#if formError}
            <div class="alert shadow-lg alert-error mb-5">
                <div class="text-center">
                    <CircleWarningIcon size="1x" class="icon_color" focusable="false" />
                    <span class="text-xs text-center">{formErrorMsg}</span>
                </div>
            </div>
            {/if}
            <!-- /Error Msg -->


            <!-- Img Preview -->
            {#if showImagePreview}
            <img class="h-32 w-auto mx-auto rounded-lg mb-5" bind:this={previewImage} src="" alt="Preview" />
            {:else}
                {#if verse.image_url != null}
                <img class="h-32 w-auto mx-auto rounded-lg mb-5" src="{image_url}" alt="Verse" />
                {/if}
            {/if}
            <!-- /Img Preview -->


            <!-- Inputs -->
            <input type="text" bind:value={verseName} on:input={() => { showEdit = true; formError = false }} placeholder="Enter a name" class="input {!showEdit ? 'input-ghost' : 'input-bordered mb-5'} w-full mr-5 font-bold text-lg text-center font-heading outline_none" />

            <input type="text" bind:value={verseDescription} on:input={() => { showEdit = true; formError = false }} placeholder="Add a description" class="input {!showEdit ? 'input-ghost' : 'input-bordered'} w-full mr-5 mb-5 text-center text-base outline_none" />
            <!-- /Inputs -->


            <!-- Edit Image -->
            {#if showEdit}
            <div class="form-control w-full {showEdit ? 'px-0' : 'px-3'} mb-5">
                <label for="v-info-img" class="label">
                    {#if verse.image_url != null}
                    <span class="label-text-alt">Change image</span>
                    {:else}
                    <span class="label-text-alt">Add an image</span>
                    {/if}
                </label>
                <input bind:this={imageInput} on:change={uploadImage} class="p-4 block w-full text-xs rounded-lg cursor-pointer focus:outline-none bg-base-300 drop-shadow-xl" type="file" accept=".jpg, .jpeg, .png, .gif">
            </div>
            {/if}
            <!-- /Edit Image -->

            
            <!-- Edit Btns -->
            {#if showEdit}
            <div class="flex justify-between items-center">
                <button type="submit" class="btn btn-primary w-[48%]">Save</button>
                <button on:click={cancelEdit} type="button" class="btn btn-error btn-outline w-[48%]">Cancel</button>
            </div>
            {:else}
            <div class="flex justify-center items-center text-sm cursor-pointer" on:click={() => showEdit = !showEdit}>
                Edit
                <label for="v-info-edit" tabindex="0" class="cursor-pointer">
                    <PenIcon size="1x" class="icon_color ml-5" focusable="false" />
                </label>
            </div>
            {/if}
            <!-- /Edit Btns -->


        </form>
        <!-- /Verse Info Form -->


        {:else}


            {#if verse.image_url != null}
            <img class="h-32 w-auto mx-auto rounded-lg mb-5" src="{image_url}" alt="Verse"/>
            {/if}
            
            <h3 class="font-bold text-lg w-full text-center m-0 mb-5">{verse.name}</h3>
            <p class="m-0 text-center">{verse.description ? verse.description : ''}</p>


        {/if}


        <label for="v-info" tabindex="0" class="cursor-pointer absolute right-0 top-0 p-3 bg-base-300 rounded-md" on:click={cancelEdit}>
            <CloseIcon size="1x" class="icon_color" focusable="false" />
        </label>


{/if}