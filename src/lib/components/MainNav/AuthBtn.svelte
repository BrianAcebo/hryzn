<script>
  import { supabase } from "$lib/utils/supabase";
  import { user } from "$lib/stores/user";
  import { CircleHelpIcon, CloseIcon, CircleCheckIcon, CircleWarningIcon, NotificationIcon, UserIcon, MessageIcon } from 'svelte-mono-icons';
  import { media } from "$lib/cssHelpers/MediaQuery";


  // Auth variables
  let email;
  let message;
  let msg_success = false;
  let msg_error = false;
  let loading;


  // Send magic link email for login
  const handleLogin = async () => {


    try {


      // Send to db
      loading = true;
      const { error } = await supabase.auth.signIn({email});


      if (error) throw error;


      // Notify user 
      msg_success = true;
      msg_error = false;
      message = 'Check your email for login link. This link will expire in 60 seconds';

    } catch (error) {


      // Notify user there was an error
      msg_error = true;
      msg_success = false;
      message = error.message;


    } finally {
      loading = false;
    }
  }


  // Destroy the login session
  const logout = () => {
    supabase.auth.signOut();
  }


  // Clear flash message
  const clearMessage = () => {
    message = '';
    msg_error = false;
    msg_success = false;
  }
</script>


{#if $user}


<!-- User Avatar -->
<div class="dropdown dropdown-end {$media.medium ? 'dropdown-left' : ''} leading-4">


  <!-- Avatar Img -->
  <div tabindex="0" class="avatar cursor-pointer">
    <div class="w-6 rounded-full ring ring-primary ring-offset-base-50 ring-offset-1">
      <img class="w-full h-full object-center object-cover" src="{!$user ? '' : `https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/${$user.avatar_url}`}" />    </div>
  </div>
  <!-- /Avatar Img -->


  <!-- Avatar Dropdown -->
  <ul tabindex="0" class="mt-7 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
    <li class="my-2">
      <a href="/profile/{$user.username}" class="relative text-center block">
        <label for="auth-user" tabindex="0" class="absolute left-3">
          <UserIcon size="1.5x" class="icon_color" focusable="false" />
        </label>
        @{$user.username}
      </a>
    </li>
    
    <li class="my-2">
      <a href="/notifications" class="relative text-center block">
        <label for="nav-notifications" tabindex="0" class="absolute left-3">
          <NotificationIcon size="1.5x" class="icon_color" focusable="false" />
        </label>

        Notifications
      </a>
    </li>

    <li class="my-2">
      <a href="/messages" class="relative text-center block">
        <label for="nav-messages" tabindex="0" class="absolute left-3">
          <MessageIcon size="1.5x" class="icon_color" focusable="false" />
        </label>
        Messages
      </a>
    </li>

    <li class="mt-3">
      <button class="btn btn-outline btn-primary modal-button tracking-wider capitalize" on:click={logout}>Logout</button>
    </li>
  </ul>
  <!-- /Avatar Dropdown -->


</div>
<!-- /User Avatar -->


{:else}


<label for="login-modal" class="md:flex hidden btn btn-outline btn-primary modal-button mr-5 capitalize">Log In / Sign Up</label>


<input type="checkbox" id="login-modal" class="modal-toggle">


<!-- Login Modal -->
<div class="modal">
  <div class="modal-box overflow-visible p-10 pb-20 relative max-w-xl">


    <!-- Success Msg -->
    {#if msg_success}
    <div class="alert shadow-lg alert-success mb-5">
      <div class="text-center">
        <CircleCheckIcon size="1x" class="icon_color" focusable="false" />
        <span class="text-xs text-center">{message}</span>
      </div>
    </div>
    {/if}
    <!-- /Success Msg -->


    <!-- Error Msg -->
    {#if msg_error}
    <div class="alert shadow-lg alert-error mb-5">
      <div class="text-center">
        <CircleWarningIcon size="1x" class="icon_color" focusable="false" />
        <span class="text-xs text-center">{message}</span>
      </div>
    </div>
    {/if}
    <!-- /Error Msg -->


    <!-- Close Btn -->
    <div class="modal-action m-0 absolute right-0 top-0">
      <label for="login-modal" class="btn btn-ghost btn-circle" on:click={clearMessage}>
        <CloseIcon size="1x" class="icon_color" focusable="false" />
      </label>
    </div>
    <!-- /Close Btn -->


    <h3 class="font-bold text-lg text-center">Passwordless through magic link!</h3>


    <!-- Modal Form -->
    <form on:submit|preventDefault={handleLogin}>
      <div class="flex flex-col text-sm mb-5 mt-5 w-full">
        <input
          type="email"
          name="email"
          class="input input-bordered input-primary w-full"
          placeholder="Enter email address..."
          bind:value={email}
        >
      </div>

      <button type="submit" class="btn btn-primary w-full">Send</button>
    </form>
    <!-- /Modal Form -->


    <!-- Tooltip -->
    <div class="tooltip tooltip-bottom right-10 mt-5 absolute" data-tip="We do not store any private info from our community. The only credential we ask for is an email address.">
      <CircleHelpIcon size="1.5x" class="icon_color" focusable="false" />
    </div>
    <!-- /Tooltip -->


  </div>
</div>
<!-- /Login Modal -->


{/if}
