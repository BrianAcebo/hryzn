<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import Icon from 'svelte-awesome';
  import check from 'svelte-awesome/icons/check';
  import exclamationCircle from 'svelte-awesome/icons/exclamationCircle';
  import infoCircle from 'svelte-awesome/icons/infoCircle';

  const dispatch = createEventDispatcher()

  
  export let type = 'error'
  export let dismissible = true
</script>


<article class={type} role="alert" transition:fade>


  {#if type === 'success'}
    <Icon data={check} scale="1.5"/>
  {:else if type === 'error'}
    <Icon data={exclamationCircle} scale="1.5"/>
  {:else}
  <Icon data={infoCircle} scale="1.5"/>
  {/if}


  <div class="text">
    <slot />
  </div>


  {#if dismissible}
    <button class="close" on:click={() => dispatch('dismiss')}>x</button>
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
