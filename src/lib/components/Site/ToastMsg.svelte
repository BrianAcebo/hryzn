<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { CheckIcon, CircleWarningIcon, CircleInformationIcon, CloseIcon } from 'svelte-mono-icons';


  const dispatch = createEventDispatcher()

  
  export let type = 'error'
  export let dismissible = true
</script>


<article class={type} role="alert" transition:fade>


  {#if type === 'success'}
    <CheckIcon size="1.5x" class="icon_color" focusable="false" />
  {:else if type === 'error'}
    <CircleWarningIcon size="1.5x" class="icon_color" focusable="false" />
  {:else}
    <CircleInformationIcon size="1.5x" class="icon_color" focusable="false" />
  {/if}


  <div class="text">
    <slot />
  </div>


  {#if dismissible}
    <button class="close" on:click={() => dispatch('dismiss')}>
      <CloseIcon size="1.5x" class="icon_color" focusable="false" />
    </button>
  {/if}


</article>


<style>
  article {
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    margin: 0 auto 0.5rem auto;
    width: 100%;
    text-align: center;
    justify-content: center;
  }

  .error {
    background: IndianRed;
  }

  .success {
    background: MediumSeaGreen;
  }

  .info {
    background: SkyBlue;
  }

  .text {
    margin-left: 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  button {
    color: white;
    background: transparent;
    border: 0 none;
    padding: 0;
    margin: 0 0 0 auto;
    line-height: 1;
    font-size: 1rem;
  }
</style>
