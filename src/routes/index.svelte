<script context="module">
  import { supabase } from "$lib/utils/supabase";
  import { user } from "$lib/stores/user";
  import { get } from "svelte/store";

  export async function load() {
  
      // Get the 

      try {


        // The user that is logged in
        // Get's the user data from user store
        const currentUser = get(user);


        if (!currentUser) {


          // Return dummy data to be replaced when comonents mounted
          // This usually just takes place on first log in
          return { props: {
            allPosts: [],
            profile: {username: 'Loading...', bio: 'Loading...', id: 1},
            suggested: []
          }};


        } else {


          // Get the posts data of the verse's the user is a part of
          const { data:posts } = await supabase
            .from('posts')
            .select()
            .eq('verse_attached', currentUser.verses_joined) 
            .order('updated_at', { ascending: false })


          // Return a new array of each post, owner, and verse data attached to it
          const allPosts = await Promise.all(posts.map(async (post) => {


            // The data of the owner of the post
            const postOwner = await supabase
              .from('profiles')
              .select()
              .eq('id', post.owner)
              .single()


            // The data of the verse the post is in
            const verseAttached = await supabase
              .from('verses')
              .select()
              .eq('id', post.verse_attached)
              .single()


            // Return the collected data
            return {
              id: post.id,
              verse: verseAttached,
              owner: postOwner,
              text: post.text,
              image_urls: post.image_urls,
              video_url: post.video_url,
            }
          }));


          // Get the data of verses of similar interest
          const { data:suggstedVerses } = await supabase
            .from('verses')
            .select()
            .match({isPublic: true, isViewable: true})


          // Get the data of profiles of similar interest
          const { data:suggestedProfiles } = await supabase
            .from('profiles')
            .select()

          
          // Combine suggested into an array to be handled easier
          const suggested = [suggstedVerses, suggestedProfiles];


          // Return the data as props
          return { props: {
            allPosts,
            profile: currentUser,
            suggested
          }};


        }


      } catch (err) {
        console.log('Error: ', err);
      }
  }
</script>

<script>
  import { onMount } from 'svelte';
  import * as THREE from "three";
  import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
  import { checkUsername, checkBio } from "$lib/utils/updateProfile";
  import { addToast } from "$lib/stores/toastMsg";
  import { mainPage } from "$lib/stores/mainPage";
  import PostCard from "$lib/components/Verse/PostCard.svelte";
  import VerseCard from '$lib/components/Verse/VerseCard.svelte';
  import MobileBtmNav from '$lib/components/Site/MobileBtmNav.svelte';
  import { openLeftMobileNav, openRightMobileNav } from "$lib/stores/openMobileNav";


  // The data collected with SSR above
  export let allPosts;
  export let profile;
  export let suggested;


  // This is to interchange between the chevron icon and the search bar in top nav
  // Search bar shows on a main page, and chevron shows on a 'sub' page to go back to the main page
  mainPage.set({
      isMainPage: true,
      mainPage: '/'
  });


  let inputEdit = false;
  let loading = true;
  let username = '@' + profile.username;
  let bio = profile.bio;

  let usernameError = false;
  let bioError = false;


  // Update profile data
  const updateProfile = async () => {


    // Remove special characters
    username = username.replace(/[^\w\s]/gi, '');


    // Check if the username and bio doesn't break any rules
    const usernameResult = await checkUsername(username);
    const bioResult = await checkBio(bio);


    // If there was an error with the username show it
    if (usernameResult.error) {
      usernameError = true;

      addToast({
        message: usernameResult.msg,
        type: "error",
        dismissible: false,
        timeout: 3000,
      });
    }


    // If there was an error with the bio show it
    if (bioResult.error) {
      bioError = true;

      addToast({
        message: bioResult.msg,
        type: "error",
        dismissible: false,
        timeout: 3000,
      });
    }


    // If there were no errors
    if (!usernameResult.error && !bioResult.error) {


      try {

        loading = true;


        // Update the profile in db
        let { error } = await supabase.from('profiles').update({username, bio}).match({ id: profile.id });


        if (error) throw error


        // Remove edit btns and assign to variable 
        inputEdit = false;
        username = '@' + username;


        // Notify the user changes were saved
        addToast({
          message: "Changes Saved",
          type: "success",
          dismissible: false,
          timeout: 3000,
        });

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
    }
  }


  // Three js canvas and it's container
  let theCanvas;
  let theContainer;


  onMount(() => {


    // Three JS Avatar
    let sceneWidth = theContainer.offsetWidth;
    let sceneHeight = theContainer.offsetHeight;


    // Scene
    const scene = new THREE.Scene();


    // Camera
    const camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 1, 1000);
    camera.position.set(0, 25, 150);
		camera.lookAt(new THREE.Vector3(0,0,0));
		camera.add(new THREE.PointLight(0xffffff,0.7)); // point light at camera position
		scene.add(camera);


    // Renderer
  	const renderer = new THREE.WebGLRenderer({ alpha: true });
  	renderer.setSize(sceneWidth, sceneHeight);
  	theCanvas.appendChild(renderer.domElement);


    // Asset Model Loader
    // For now we hard code an astrounaut. This will change later when user's have their own avatars
    const loader = new FBXLoader();
    loader.load('/3D/verse/avatars/man-astronaut.fbx', function (object) {

      object.name = 'avatar'
      object.position.set(0, -100, 0);

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

    	scene.add(object);

    }, function (xhr) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, function (error) {
      console.error(error);
    });


    // Lighting
    const light = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(500, 500, 500);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);


    // Resize window
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
      camera.aspect = sceneWidth / sceneHeight
      camera.updateProjectionMatrix()
      renderer.setSize(sceneWidth, sceneHeight)
      render()
    }


    // Run Animation
    function animate() {
      requestAnimationFrame(animate);
      render()
    }


    // Run Render
    function render() {
      renderer.render(scene, camera)
    }


    // Run it all
    animate()

  });
</script>


<svelte:head>
    <title>Find your people.</title>
    <meta property="og:title" name="og:title" content="Find your people." />
    <meta property="description" name="description" content="Hryzn is a social platform where communities can connect through niche topics." />
    <meta property="og:description" name="og:description" content="Hryzn is a social platform where communities can connect through niche topics." />
</svelte:head>


<!-- Index Container -->
<div class="flex flex-col w-full lg:flex-row z-0 lg:pt-5 lg:px-10 p-5 h-[90vh]">


  <!-- Avatar Container -->
  <div class="grid flex-grow lg:w-1/4 w-3/4 h-screen lg:h-auto top-0 z-50 lg:z-30 bg-base-100 {$openLeftMobileNav ? 'left-0' : 'left-[-100%]'} lg:left-0 fixed overflow-y-auto p-10 lg:p-0 lg:static lg:drop-shadow-none drop-shadow-lg ease-in-out duration-300">
    <div class="border border-neutral mockup-window w-full flex flex-col overflow-hidden">


      <!-- Three JS Container -->
      <div bind:this={theContainer} class="flex justify-center w-full h-[23rem]">
        <div id="canvas" bind:this={theCanvas}/>
      </div>
      <!-- /Three JS Container -->


      <!-- Bottom Profile Form -->
      <form on:submit|preventDefault={updateProfile} class="p-10">
        <input bind:value={username} on:input={() => {inputEdit = true; usernameError = false}} type="text" placeholder="@username" class="{usernameError ? 'input-error px-5' : ''} rounded-none input w-full focus:outline-none p-0 mb-5">

        <textarea bind:value={bio} on:input={() => {inputEdit = true; bioError = false}} class="{bioError ? 'input-error px-5' : ''} textarea w-full focus:outline-none p-0 rounded-none" placeholder="Add a cool bio to show off to friends!"></textarea>

        {#if inputEdit}
        <button type="submit" class="btn btn-primary mt-5 w-full">Save Changes</button>
        <button on:click={() => inputEdit = false} type="button" class="btn btn-ghost mt-5 w-full">Cancel</button>
        {/if}
      </form>
      <!-- /Bottom Profile Form -->


    </div>
  </div>
  <!-- /Avatar Container -->


  <div class="divider lg:divider-horizontal lg:flex hidden"></div>


  <!-- Feed Container -->
  <div class="w-full lg:w-2/5">

    <h3 class="text-lg ml-3 w-1/5 mx-auto py-3 border-b-2 border-neutral">My Feed</h3>

    <div class="overflow-y-scroll h-[80vh] no_scrollbar relative">
      {#await allPosts then posts}
        {#if posts.length > 0}
          {#each posts as post}
          <PostCard {post} isOwnerOfVerse={post.verse.data.owner == profile.id} />
          {/each}
        {:else}
          {#if profile.id == 1 || typeof profile.username == 'undefined' }
          <h3 class="text-center mt-12">Please reload the browser.</h3>
          {:else}
          <h3 class="text-center mt-12">No posts yet.</h3>
          {/if}
        {/if}
      {/await}
    </div>
  
  </div>
  <!-- /Feed Container -->


  <div class="divider lg:divider-horizontal lg:flex hidden"></div>


  <!-- News and Suggested Container -->
  <div class="flex flex-col flex-grow lg:w-1/4 w-3/4 h-screen lg:h-auto top-0 z-50 lg:z-30 bg-base-100 {$openRightMobileNav ? 'right-0' : 'right-[-100%]'} lg:right-0 fixed overflow-y-auto p-10 lg:p-0 lg:static lg:drop-shadow-none drop-shadow-lg ease-in-out duration-300">
    

    <!-- News -->
    <h3 class="text-lg ml-3 mx-auto py-3 border-b-2 border-neutral mb-5">News</h3>

    <div class="bg-base-300 h-32 w-full rounded-lg flex justify-center items-center text-center mb-10">There is no news.</div>
    <!-- /News -->


    <!-- Suggested -->
    <h3 class="text-lg ml-3 mx-auto py-3 border-b-2 border-neutral mb-5">Suggested</h3>

    <div class="w-full rounded-lg flex flex-col">

      <div class="carousel w-full">
        {#await suggested then sv}
          {#if sv.length > 0}
            {#each sv[0] as verse, i}
            <div id="slide{i}" class="carousel-item relative w-full z-0">

              <VerseCard {verse} />

              <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                {#if i > 0}
                <a href="#slide{i == 0 ? i : i - 1}" class="btn btn-circle mr-auto">❮</a> 
                {/if}

                {#if i < sv[0].length - 1}
                <a href="#slide{i + 1}" class="btn btn-circle ml-auto">❯</a>
                {/if}
              </div>
            </div> 
            {/each}
          {:else}
          <h3 class="text-center mt-12">Loading...</h3>
          {/if}
        {/await}
      </div>
    </div>
    <!-- /Suggested -->


  </div>
  <!-- /News and Suggested Container -->


</div>
<!-- /Index Container -->


<!-- Mobile Btm Nav -->
<MobileBtmNav page={'index'} />
<!-- /Mobile Btm Nav -->

