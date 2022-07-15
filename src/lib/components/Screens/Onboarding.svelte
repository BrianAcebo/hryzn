<script>
  import { checkUsername, checkBio } from "$lib/utils/updateProfile";
  import { addToast } from "$lib/stores/toastMsg";
  import { Circle } from 'svelte-loading-spinners';
  import { supabase } from "$lib/utils/supabase";
  import { onboardingComplete } from "$lib/stores/onboardComplete";


  // Onboarding variables
  let active_step;
  let username;
  let bio;
  let usernameError = false;
  let bioError = false;
  let loading = false;
  let file;
  let filePath = 'no-profile-img.jpg';


  // Create a preview of image on upload
  let imageInput;
  let previewImage;
  let showImagePreview = false;

  const uploadImage = () => {


    file = imageInput.files[0];


      // Allowed file types
    const allowedFileExt = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    

    // Make sure there was a file      
    if (file) {


      // If not an allowed file type
      if (!allowedFileExt.exec(file.name)) {


        // Notify there was an error
        imgError = true;
        imageInput.value = '';


        // Reset image preview
        showImagePreview = false;


        // Notify there was an error
        addToast({
          message:'Only jpg, jpeg, png, and gif file types are allowed.',
          type: "error",
          dismissible: false,
          timeout: 3000,
        });


        return false;


      } else {


        // Set variables
        imgError = false;
        showImagePreview = true;


        // Give src attribute to image preview element
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            previewImage.setAttribute("src", reader.result);
        });
        reader.readAsDataURL(file);


        // Rename the file
        const fileExt = file.name.split('.').pop();
        const randomName = `${Math.random()}.${fileExt}`;
        const fileName = randomName.substring(randomName.indexOf('0.') + 2);
        filePath = `${fileName}`;


        return;


      }

      
    }
  }


  // On submit
  const handleSubmit = async () => {


    // Validation
    const usernameResult = await checkUsername(username);
    const bioResult = await checkBio(bio);


    // If there was a validation error
    if (usernameResult.error) {


      // Notify there was an error
      usernameError = true;

      addToast({
        message: usernameResult.msg,
        type: "error",
        dismissible: false,
        timeout: 3000,
      });


    }


    // If there was a validation error
    if (bioResult.error) {


      // Notify there was an error
      bioError = true;

      addToast({
        message: bioResult.msg,
        type: "error",
        dismissible: false,
        timeout: 3000,
      });


    }


    // If no validation errors
    if (!usernameResult.error && !bioResult.error) {


      try {


        loading = true;


        // The logged in user
        const user = supabase.auth.user();


        // Insert into db
        await supabase.from('onboarding').upsert({id: user.id, completed: true});


        // Create a new profile for user
        const { error } = await supabase.from('profiles').upsert({
          id: user.id, 
          username: username, 
          bio: bio,
          avatar_url: filePath
        });


        if (error) throw error


        // Set onboarding store to completed
        onboardingComplete.set(true);


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


  // Change the onboarding tabs
  let steps = ['Welcome', 'Discover', 'Create', 'Profile'];
  let currentActive = 0;
	let circles, progress;

  const handleProgress = (stepIncrement) => {
    circles = document.querySelectorAll('.circle');

    // Add a step
    if(stepIncrement == 1) {


      currentActive++


      // If at the end, don't allow more movement
      if (currentActive > circles.length) {
        currentActive = circles.length;
      }


    } else {


      // Remove a step
      currentActive--


      // If at the beginning, don't allow more movement
      if (currentActive < 0) {
        currentActive = 0;
      }


    }


    // Update the circles
    update()
  }


  // Update the circles
	const update = () => {
    circles.forEach((circle, idx) => {
      if(idx < currentActive) {
        circle.classList.add('active')
      } else {
        circle.classList.remove('active')
      }
    })

    const actives = document.querySelectorAll('.active');

    progress.style.width = (actives.length - 1) / (circles.length - 1) * 100 + '%';
	}
</script>


<!-- Onboarding Container -->
<div class="container mx-auto py-4 max-w-sm flex justify-center items-center flex-col">

  <form class="w-full mb-12">
    <div class="mockup-window border bg-base-300">
      <div class="flex justify-center px-4 py-8 {loading ? 'pb-40' : ''} bg-base-200 flex-col relative">


        {#if steps[currentActive] == 'Welcome'}


        <img src="/img/site/onboarding/welcome.png" class="max-w-sm rounded-lg shadow-2xl" alt="welcome">
        <h3 class="text-center my-10 font-bold text-xl">Welcome To Hryzn</h3>
        <p class="text-center">Hryzn is a social platform to connect with your people in a 3D virtual space.</p>


        {:else if steps[currentActive] == 'Discover'}


        <img src="/img/site/onboarding/discover.png" class="max-w-sm rounded-lg shadow-2xl" alt="connect">
        <h3 class="text-center my-10 font-bold text-xl">Discover & Connect With Your People</h3>
        <p class="text-center">Explore and connect with countless communities through a variety of niche topics.</p>


        {:else if steps[currentActive] == 'Create'}


        <img src="/img/site/onboarding/create.png" class="max-w-sm rounded-lg shadow-2xl" alt="create">
        <h3 class="text-center my-10 font-bold text-xl">Create Your Own Space</h3>
        <p class="text-center">Create, edit, and enjoy your own 3D virtual spaces to hangout or share with friends.</p>


        {:else if steps[currentActive] == 'Profile'}


          {#if loading}
          <div class="absolute right-0 left-0 top-1/3 m-auto w-40 text-center wrapper">
            <Circle size="60" color="icon_color" unit="px"></Circle>
          </div>
          {:else}
            <h3 class="text-center my-10 font-bold text-xl">Lastly, let's finish setting up your profile!</h3>


            {#if showImagePreview}
            <img class="h-32 w-auto mx-auto rounded-lg mb-5" bind:this={previewImage} src="" alt="Preview" />
            {/if}


            <div class="w-full">
              <label for="on-username" class="label">
                <span class="label-text">Username</span>
              </label>
              <input bind:value={username} on:input={() => usernameError = false} type="text" placeholder="robochicken123" class="{usernameError ? 'input-error' : ''} input input-bordered w-full mb-5" required>

              <label for="on-bio" class="label">
                <span class="label-text">Bio <span class="text-xs">(200 chars)</span></span>
              </label>
              <textarea bind:value={bio} on:input={() => bioError = false} type="text" placeholder="I like robots and chickens." class="{bioError ? 'input-error' : ''} input input-bordered w-full mb-5"></textarea>

              <div class="form-control w-full">
                <label for="on-img" class="label">
                    <span class="label-text-alt">Add an profile image</span>
                </label>
                <input bind:this={imageInput} on:change={uploadImage} class="p-4 block w-full text-xs rounded-lg cursor-pointer focus:outline-none bg-base-300 drop-shadow-xl" type="file" accept=".jpg, .jpeg, .png, .gif">
              </div>
            </div>
          {/if}


        {/if}


      </div>
    </div>
  </form>


  <!-- Progress Container-->
  <div class="progress-container" bind:this={circles}>
    <div class="progress bg-primary" bind:this={progress}></div>
    {#each steps as step, i}
    <div class="circle {i == 0 ? 'active' : ''}" ></div>
    {/each}
  </div>
  <!-- /Progess Container-->


</div>
<!-- /Onboarding Container -->


<!-- Step btns -->
<div class="step-btns w-full m-auto justify-between items-center flex">


  <button class="btn" on:click={() => handleProgress(-1)} disabled={currentActive == 0}>Prev</button>


  {#if currentActive == steps.length - 1}
  <button class="btn btn-primary" on:click={handleSubmit}>Finish</button>
  {:else}
  <button class="btn btn-primary" on:click={() => handleProgress(1)} disabled={currentActive == steps.length}>Next</button>
  {/if}


</div>
<!-- /Step btns -->


<style>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  .step-btns {
    max-width: 12rem;
  }

	.progress-container {
		display: flex;
		justify-content: space-between;
		position: relative;
		margin-bottom: 30px;
		max-width: 100%;
		width: 350px;
	}

	.progress-container::before {
		content: '';
		background-color: #e0e0e0;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 100%;
		z-index: -1;
	}

	.progress {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 0%;
		z-index: -1;
		transition: 0.4s ease;
	}

	.circle {
		background-color: #fff;
		color: #999;
		border-radius: 50%;
		height: 30px;
		width: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid #e0e0e0;
		transition: 0.4s ease;
		cursor: pointer;
	}

	.circle::after{
		content: attr(data-title) " ";
		position: absolute;
		bottom: 35px;
		color: #999;
		transition: 0.4s ease;
	}

	.circle.active::after {
		color: currentColor;
	}

	.circle.active {
		border-color: currentColor;
	}
</style>
