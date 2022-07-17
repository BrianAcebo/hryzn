<script>
  import Icon from 'svelte-awesome';
  import exclamationCircle from 'svelte-awesome/icons/exclamationCircle';
  import { Circle } from 'svelte-loading-spinners';
  import { addToast } from "$lib/stores/toastMsg";
  import { supabase } from "$lib/utils/supabase";
  import { user } from "$lib/stores/user";
  import { goto } from '$app/navigation';


  // Verse variables
  let vName;
  let isPublic = true;
  let isViewable = true;
  let vSlug;
  let loading = false;
  let verseNext = 0;
  let nameError = false;
  let nameErrorMsg = '';


  // Check if Verse has correct name
  const checkVerseName = (name) => {


    // No name
    if (name == '' || typeof name == 'undefined') {
      nameError = true;
      nameErrorMsg = 'Please enter a name.';
      return false;
    }


    // Name too small or large
    if (name.length < 3 || name.length > 200) {
      nameError = true;
      nameErrorMsg = 'Name must be between 3 and 200 characters.';
      return false;
    }


    // Capitalize first letter
    vName = name.charAt(0).toUpperCase() + name.slice(1);


    // Sanitize for SEO slug
    name = name.replace(/\ /g, '-');
    name = name.replace(/[^A-Za-z-]/g, "");
    vSlug = name.toLowerCase();


    nameError = false;
    nameErrorMsg = '';
    return true;
  }


  // Advance verse create modal steps
  const verseNextBtn = async () => {


    if (checkVerseName(vName)) {


      // Move forward
      if (verseNext != 2) {


        verseNext = verseNext + 1;


      } else {


        // Last modal step
        verseNext = 0;
        loading = true;


        try {


          // Create the verse
          const { data, error } = await supabase.from('verses').insert([{
            owner: $user.id,
            name: vName,
            isPublic: isPublic,
            isViewable: isViewable,
            members: [$user.id]
          }]);


          // Create the slug
          vSlug = vSlug + '-HSL0' + data[0].id;
          await supabase.from('verses').update({ slug: vSlug }).match({ id: data[0].id });


          // Create the main chat
          await supabase.from('chat').insert({
            verse_attached: data[0].id,
            page_attached: 'main',
            owner: $user.id
          });


          // Add verse id to exisiting $user's verses joined array
          let joined = [data[0].id];
          joined = joined.concat($user.verses_joined);

          await supabase.from('profiles').update({
              verses_joined: joined
          }).eq('id', $user.id);


          if (error) throw error


          // All good
          addToast({
            message: 'Verse Created',
            type: "success",
            dismissible: false,
            timeout: 3000,
          });


          // Redirect back to page to reload
          goto('/v/' + vSlug);


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
  }
</script>


<form>


  <input type="checkbox" id="create-verse" class="modal-toggle">


  <!-- Create Modal -->
  <div class="modal">
    <div class="modal-box relative {loading ? 'p-20' : ''}">


      {#if loading}


      <div class="absolute right-0 left-0 top-1/3 m-auto w-40 text-center wrapper flex justify-center">
        <Circle size="60" color="icon_color" unit="px"></Circle>
      </div>


      {:else}


      <label for="create-verse" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>


      <h3 class="text-lg font-bold mb-5">Create a Verse</h3>


      <!-- Modal Content -->
      <div class="w-full">


        {#if verseNext == 0}


          {#if nameError}
          <div class="alert shadow-lg alert-error mb-5">
            <div class="text-center">
              <Icon data={exclamationCircle} />
              <span class="text-xs text-center">{nameErrorMsg}</span>
            </div>
          </div>
          {/if}


          <input bind:value={vName} on:input={() => nameError = false} type="text" placeholder="Give it a cool name" class="{nameError ? 'input-error' : ''} input input-bordered w-full mb-5" required />


        {:else if verseNext == 1}


          <div class="form-control bg-base-300 p-5 rounded-lg">
            <div class="flex justify-center items-center flex-row w-full">
              <label for="v-is-public" class="p-5 label cursor-pointer mx-2 badge {isPublic ? 'badge-secondary' : 'badge-ghost'}" on:click={() => isPublic = true}>
                <span class="label-text mr-2">Public</span>
                <input type="radio" name="radio-6" class="radio checked:bg-blue-500" checked />
              </label>

              <label for="v-is-private" class="p-5 label cursor-pointer mx-2 badge {isPublic ? 'badge-ghost' : 'badge-secondary'}" on:click={() => isPublic = false}>
                <span class="label-text mr-2">Private</span>
                <input type="radio" name="radio-6" class="radio checked:bg-blue-500" />
              </label>
            </div>

            <p class="mt-5 text-xs text-center">
            {#if isPublic}
            Anyone can join and be a part of this verse.
            {:else}
            User's must request access and be approved to join.
            {/if}
            </p>
          </div>


        {:else if verseNext == 2}


          <div class="form-control bg-base-300 p-5 rounded-lg">
            <label for="v-is-viewable" class="label cursor-pointer">
              <span class="label-text">Would you like this verse to be viewable on the explore page?</span>
              <input type="checkbox" class="toggle toggle-secondary" checked on:click={() => isViewable = !isViewable} />
            </label>
          </div>


        {/if}

        
        <div class="flex justify-between items-center flex-row w-full">
          {#if verseNext > 0}
          <button type="button" class="btn btn-ghost text-xs mt-5" on:click={() => verseNext = verseNext - 1}>Back</button>
          {/if}
          <button type="{verseNext == 2 ? 'button' : 'button'}" class="btn btn-primary text-xs mt-2" on:click={verseNextBtn}>{verseNext == 2 ? 'Create' : 'Next'}</button>
        </div>


      </div>
      <!-- /Modal Content -->


      {/if}


    </div>
  </div>
  <!-- /Create Modal -->


</form>
