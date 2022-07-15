<script>
  import { ChevronLeftIcon } from 'svelte-mono-icons';

  let currentCategory = '';

  // This is the 3D model assets menu for verse meta edit
</script>



<ul class="menu p-4 overflow-y-auto w-60 md:w-80 bg-base-100 text-base-content">

  {#if currentCategory === ''}
  <li on:click={() => { currentCategory = 'environment' }}>Environment</li>
  <li>More coming soon :)</li>
  {:else}

  <button class="btn btn-square btn-outline m-w-xs mb-5" on:click={() => { currentCategory = ''}}>
    <ChevronLeftIcon size="1.5x" class="icon_color cursor-pointer" focusable="false" />
  </button>

  <p class="mb-5">Trees</p>

  <div class="carousel w-full">
    <div id="slide1" class="carousel-item relative w-full">
      <img src="/3D/verse/environment/trees/palm-preview.png" class="w-full" alt="trees">
      <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide4" class="btn btn-circle">❮</a>
        <a href="#slide2" class="btn btn-circle">❯</a>
      </div>
    </div>

    <div id="slide2" class="carousel-item relative w-full">
      <img src="https://api.lorem.space/image/car?w=800&h=200&hash=500B67FB" class="w-full" alt="trees"> /
      <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide1" class="btn btn-circle">❮</a>
        <a href="#slide3" class="btn btn-circle">❯</a>
      </div>
    </div>

    <div id="slide3" class="carousel-item relative w-full">
      <img src="https://api.lorem.space/image/car?w=800&h=200&hash=A89D0DE6" class="w-full" alt="trees"> /
      <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide2" class="btn btn-circle">❮</a>
        <a href="#slide4" class="btn btn-circle">❯</a>
      </div>
    </div>

    <div id="slide4" class="carousel-item relative w-full">
      <img src="https://api.lorem.space/image/car?w=800&h=200&hash=225E6693" class="w-full" alt="trees"> /
      <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide3" class="btn btn-circle">❮</a>
        <a href="#slide1" class="btn btn-circle">❯</a>
      </div>
    </div>
  </div>
  {/if}
</ul>
