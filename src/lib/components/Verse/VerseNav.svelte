<script>
    import VerseImage from '$lib/components/Verse/VerseImage.svelte';
    import VerseLinks from '$lib/components/Verse/VerseLinks.svelte';
    import VersePages from '$lib/components/Verse/VersePages.svelte';
    import { addToast } from "$lib/stores/toastMsg";
    import { user } from "$lib/stores/user";
    import { supabase } from "$lib/utils/supabase";
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { openLeftMobileNav } from "$lib/stores/openMobileNav";
import { loop_guard } from 'svelte/internal';


    // Component props passed over
    export let verse;
    export let isOwnerOfVerse;
    export let pages;


    // Check if user is already a member
    let isMember = verse.members.indexOf($user.id) != -1;
    let loading = false;


    // Update a user's membership
    const updateMembers = async () => {


        // We don't want them pressing btns when it's processing/loading
        if (!loading) { 


            // If they're already a member
            if (isMember) {

                
                // Remove user from verse
                try {


                    loading = true;


                    // Remove user id from verses' members array
                    const memberIndex = verse.members.indexOf($user.id);
                    let members = verse.members;
                    members.splice(memberIndex, 1);

                    const { data, error } = await supabase.from('verses').update({
                        members: members
                    }).eq('id', verse.id);
                    

                    // Remove verse id from user's verses_joined array
                    const verseIndex = $user.verses_joined.indexOf(verse.id);
                    let joined = $user.verses_joined;
                    joined.splice(verseIndex, 1);

                    await supabase.from('profiles').update({
                        verses_joined: joined
                    }).eq('id', $user.id);


                    // Notify the user they were removed
                    addToast({
                        message: "Removed",
                        type: "success",
                        dismissible: false,
                        timeout: 3000,
                    });


                    // Redirect back to page to reload the browser
                    goto('/v/' + $page.params.slug);


                } catch (error) {


                    // Notify there was an error
                    addToast({
                        message: error.message,
                        type: "error",
                        dismissible: false,
                        timeout: 3000,
                    });


                }


            } else {


                // Add user to verse members
                // If the verse is private we need the owner's approval
                // For now it's just public
                if (verse.isPublic) {


                    try {


                        loading = true;


                        // Add user id to exisiting verse members array
                        let members = [$user.id];
                        members = members.concat(verse.members);

                        const { data, error } = await supabase.from('verses').update({
                            members: members
                        }).eq('id', verse.id);


                        // Add verse id to exisiting verses joined array
                        let joined = [verse.id];
                        joined = joined.concat($user.verses_joined);

                        await supabase.from('profiles').update({
                            verses_joined: joined
                        }).eq('id', $user.id);


                        // Notify the user they were added
                        addToast({
                            message: "Joined",
                            type: "success",
                            dismissible: false,
                            timeout: 3000,
                        });


                        // Redirect back to page to reload the browser
                        goto('/v/' + $page.params.slug);



                    } catch (error) {


                        // Notify there was an error
                        addToast({
                            message: error.message,
                            type: "error",
                            dismissible: false,
                            timeout: 3000,
                        });


                    }


                }

            }

        }
    }
</script>

<div class="grid flex-grow lg:w-1/4 w-3/4 h-screen lg:h-auto top-0 z-50 lg:z-30 bg-base-100 {$openLeftMobileNav ? 'left-0' : 'left-[-100%]'} lg:left-0 fixed overflow-y-auto p-10 lg:p-0 lg:static lg:drop-shadow-none border-r-2 border-base-300 lg:border-none ease-in-out duration-300">


    <!-- Verse Image -->
    <VerseImage name={verse.name} image_url={verse.image_url} />
    <!-- /Verse Image -->


    <!-- Join Verse Btn -->
    {#if !isOwnerOfVerse}
        {#if loading}

        <button class="btn my-5 w-full" disabled>Loading...</button>

        {:else}
        <button class="btn my-5 w-full" on:click={updateMembers}>
            {#if isMember}
            Remove from Verse
            {:else}
            Join Verse
            {/if}
        </button>
        {/if}
    {/if}
    <!-- /Join Verse Btn -->


    <!-- Verse Links -->
    <VerseLinks verse={verse} {isOwnerOfVerse} />
    <!-- /Verse Links -->


    <!-- Verse Pages -->
    <VersePages verse={verse} {isOwnerOfVerse} {pages} />
    <!-- /Verse Pages -->


  </div>