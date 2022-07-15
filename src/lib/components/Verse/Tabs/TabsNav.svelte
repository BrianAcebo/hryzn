<script>
    import { currentTab } from "$lib/stores/Verse/tabs";
    import { EditIcon } from 'svelte-mono-icons';
    import CreatePost from "$lib/components/Verse/Tabs/CreatePost.svelte";
    import { longerPost } from "$lib/stores/Verse/longerPost";


    // Nice quotes to use as placeholders
    let placeholder;
    const nice_placeholders = [
        "I hope you're having a nice day.",
        "How's your day going?",
        "You look beautiful today.",
        "Share you're smile with someone.",
        "Nice hair :)"
    ];


    // Choose a random placeholder from the array above
    let i;
    let prev_i;
    const choosePlaceholder = () => {


      // Pick a random number from 0-4
      i = Math.floor(Math.random() * 5);


      // If the random number is eqaul to the last random number
      if (i == prev_i) {


        // If the random number is the last in array
        if (i == nice_placeholders.length - 1) {


          // Pick the placeholder from the index below the random number in the array
          placeholder = nice_placeholders[i - 1];
          prev_i = i - 1;


        } else {


          // Pick the placeholder from the index above the random number in the array
          placeholder = nice_placeholders[i + 1];
          prev_i = i + 1;


        }


      } else {


        // Pick the placeholder from its index in the array
        placeholder = nice_placeholders[i];
        prev_i = i;


      }
    }
</script>


<div class="tabs w-full mx-auto text-center flex flex-row justify-center items-center pb-5 relative">
    

    <!-- Nav -->
    <a class="tab tab-bordered px-10 {$currentTab == 0 ? 'tab-active' : ''}" on:click={() => currentTab.set(0)}>Posts</a>
    <a class="tab tab-bordered px-10 {$currentTab == 1 ? 'tab-active' : ''}" on:click={() => currentTab.set(1)}>Chat</a>
    <!-- <a class="tab tab-bordered px-10 {$currentTab == 2 ? 'tab-active' : ''}" on:click={() => currentTab.set(2)}>Forum</a> -->
    <!-- /Nav -->


    <!-- Open Create Post Modal -->
    <div on:click={choosePlaceholder} class="absolute right-5 justify-center items-center {$currentTab == 0 ? 'flex' : 'hidden'}">
      <a href="#create-post" class="btn btn-circle modal-button flex justify-center items-center text-xs">
        <label for="open-post" class="text-xs cursor-pointer">
          <EditIcon size="1.5x" class="icon_color text-xs" focusable="false" />
        </label>
      </a>
    </div>
    <!-- /Open Create Post Modal -->


    <!-- Create Post Modal -->
    <div class="modal modal-bottom" id="create-post">
      <div class="modal-box ease-in-out duration-300 {$longerPost ? 'max-w-[800px] h-[80vh]': ''}">
        <CreatePost {placeholder} />
      </div>
    </div>
    <!-- /Create Post Modal -->


</div>