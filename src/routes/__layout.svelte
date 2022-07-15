<script>
  import { supabase } from "$lib/utils/supabase";
  import Navbar from "$lib/components/MainNav/Navbar.svelte";
  import Welcome from "$lib/components/Screens/Welcome.svelte";
  import { user } from "$lib/stores/user";
  import "../styles.css";
  import Loading from "$lib/components/Screens/Loading.svelte";
  import { onMount } from 'svelte';
  import Toast from '$lib/components/Site/ToastMsg.svelte';
  import { dismissToast, toasts } from '$lib/stores/toastMsg';
  import Onboarding from "$lib/components/Screens/Onboarding.svelte";
  import { onboardingComplete } from "$lib/stores/onboardComplete";
  import CreateVerseModal from '$lib/components/MainNav/CreateVerseModal.svelte';
  import { media } from "$lib/cssHelpers/MediaQuery";
  import { authenticated } from "$lib/stores/auth";


  // Set supabase auth info into authenticated store
  // Set the initial user info into user store. It will eventually be rewritten
  supabase.auth.onAuthStateChange((session) => {
    authenticated.set(session);
    user.set(supabase.auth.user());
  });


  // Checks to see if a user completed their onboarding
  const checkOnboardingComplete = async () => {


    // Check onboarding complete data in local storage that is stored in onboardComplete store
    if (!$onboardingComplete) {


      // If no data in local storage then we check the DB
      try {


        let { data, error, status } = await supabase
          .from('onboarding')
          .select(`completed`)
          .eq('id', $user.id)
          .single();


        if (error && status !== 406) throw error;


        if (!data) {


          // If nothing found in db then insert that onboarding is not completed
          // Happens for new profiles that were just freshly created
          let { error } = await supabase.from('onboarding').upsert({id: user.id, completed: false});


          if (error) throw error;


          return false;


        } else {


          // If there was data, set the onboardComplete store which will also add data to local storage
          onboardingComplete.set(data.completed);


          return true;

        }

      } catch (error) {
        alert(error.message);
      }


    } else {
      return true;
    }
  }


  let mountComplete = false; // Show loading screen until components mounted
	onMount(async () => {

		mountComplete = true;


    // If the profile data hasn't been stored yet i.e. user just logged in
    if ($user && !$user.username) {


      // Check if completed onboarding
      const onboardIsComplete = await checkOnboardingComplete();


      // If onboarding is completed
      if (onboardIsComplete) {


        // Replace the current data in user store with the user's profile info
        let { data:profile } = await supabase
            .from('profiles')
            .select()
            .eq('id', $user.id)
            .single()

        user.set(profile);


      }


    }


	});
</script>


{#if mountComplete}


  {#if $user}


    {#if $onboardingComplete}
    <Navbar />
    {/if}


  <!-- Page Container -->
  <div class="w-full {$media.medium ? 'pt-12' : 'pt-20'}">


    <!-- Toast Notifications -->
    {#if $toasts}
    <section class="{$onboardingComplete ? 'toast_section' : 'toast_section_onboard'}">
      {#each $toasts as toast (toast.id)}
        <Toast
          type={toast.type}
          dismissible={toast.dismissible}
          on:dismiss={() => dismissToast(toast.id)}>{toast.message}</Toast>
      {/each}
    </section>
    {/if}
    <!-- /Toast Notifications -->


    <!-- Main Content -->
    {#if $onboardingComplete}

    <slot></slot>

    {:else}

    <div class="w-full pb-20">
      <Onboarding />
    </div>

    {/if}
    <!-- /Main Content -->

  </div>
  <!-- /Page Container -->


  <!-- Create verse modal pop up -->
  <CreateVerseModal />
  <!-- /Create verse modal pop up -->


  {:else}


  <Navbar />

  <Welcome />


  {/if}


{:else}


<!-- Loading Screen -->
<Loading />
<!-- /Loading Screen -->


{/if}


<style>
  :global(.icon_color path) {
    fill: currentColor;
  }

  :global(.no_scrollbar path) {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  :global(.no_scrollbar::-webkit-scrollbar path) {
    display: none;
  }

  :global(.outline_none path) {
    outline: none;
  }

  .toast_section {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    margin-top: 5rem;
    justify-content: center;
    flex-direction: column;
    z-index: 1000;
    text-align: center;
  }

  .toast_section_onboard {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: 1000;
    text-align: center;
  }
</style>
