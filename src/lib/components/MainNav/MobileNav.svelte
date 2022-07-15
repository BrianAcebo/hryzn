<script>
  import UserNavIcons from './UserNavIcons.svelte';
  import IconLogo from '$lib/components/Brand/IconLogo.svelte';
  import { MoonIcon, ChevronLeftIcon, SearchIcon } from 'svelte-mono-icons';
  import AuthBtn from './AuthBtn.svelte';
  import { themeChange } from 'theme-change';
  import { onMount } from 'svelte';
  import { mainPage } from "$lib/stores/mainPage";


  let openMobile = false;


  onMount(() => {
    themeChange(false);
  })
</script>

<!-- Mobile Top Nav -->
<div class="fixed navbar bg-base-100 mb-40 border-b-2 border-base-300 px-8 main-top-nav z-50 min-h-12 text-center flex justify-center items-center">
  <div class="absolute left-5">


    {#if !$mainPage.isMainPage}


    <!-- Chevron Left -->
    <a href="{$mainPage.mainPage}">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <ChevronLeftIcon size="1.5x" class="icon_color" focusable="false" />
      </label>
    </a>
    <!-- /Chevron Left -->


    {/if}


  </div>

  <a href="/" class="normal-case text-md font-semibold tracking-wider flex flex-row items-center">Hryzn <h3 class="normal-case text-sm italic font-normal inline ml-2 tracking-normal">alpha</h3></a>
</div>
<!-- /Mobile Top Nav -->


<!-- Mobile Side Nav -->
<ul class="fixed z-40 {openMobile ? 'right-0' : 'right-[-60px]'} w-[75px] h-screen menu bg-base-100 text-base-content overflow-y-visible drop-shadow-lg ease-in-out duration-300 no_scrollbar">
  <div class="flex justify-evenly items-center w-full absolute flex-col p-4 top-5 h-[88%]">

    
    <!-- Side Nav Btn -->
    <div class="flex flex-col items-center justify-center drawer-content -ml-20">
      <label class="btn btn-circle btn-primary drawer-button lg:hidden" on:click={() => openMobile = !openMobile}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
      </label>
    </div>
    <!-- /Side Nav Btn -->


    <IconLogo />


    <div class="flex flex-col">
      <UserNavIcons />
    </div>


    <!-- Themes -->
    <div class="dropdown dropdown-left dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <MoonIcon size="1.5x" class="icon_color" focusable="false" />
      </label>

      <div class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px h-96 w-52 overflow-y-auto shadow-2xl mt-16 no_scrollbar">
        <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 mobile_nav_list no_scrollbar">
          <li><button data-set-theme="light" data-act-class="active">🌝 Light</button></li>
          <li><button data-set-theme="dark" data-act-class="active">🌚 Dark</button></li>
          <li><button data-set-theme="cupcake" data-act-class="active">🧁 Cupcake</button></li>
          <li><button data-set-theme="bumblebee" data-act-class="active">🐝 Bumblebee</button></li>
          <li><button data-set-theme="emerald" data-act-class="active">✳️ Emerald</button></li>
          <li><button data-set-theme="corporate" data-act-class="active">🏢 Corporate</button></li>
          <li><button data-set-theme="synthwave" data-act-class="active">🌃 Synthwave</button></li>
          <li><button data-set-theme="retro" data-act-class="active">👴 Retro</button></li>
          <li><button data-set-theme="cyberpunk" data-act-class="active">🤖 Cyberpunk</button></li>
          <li><button data-set-theme="valentine" data-act-class="active">🌸 Valentine</button></li>
          <li><button data-set-theme="halloween" data-act-class="active">🎃 Halloween</button></li>
          <li><button data-set-theme="garden" data-act-class="active">🌷 Garden</button></li>
          <li><button data-set-theme="forest" data-act-class="active">🌲 Forest</button></li>
          <li><button data-set-theme="aqua" data-act-class="active">🐟 Aqua</button></li>
          <li><button data-set-theme="lofi" data-act-class="active">👓 Lofi</button></li>
          <li><button data-set-theme="pastel" data-act-class="active">🖍 Pastel</button></li>
          <li><button data-set-theme="fantasy" data-act-class="active">🧚‍♀️ Fantasy</button></li>
          <li><button data-set-theme="wireframe" data-act-class="active">📝 Wireframe</button></li>
          <li><button data-set-theme="black" data-act-class="active">🏴 Black</button></li>
          <li><button data-set-theme="luxury" data-act-class="active">💎 Luxury</button></li>
          <li><button data-set-theme="dracula" data-act-class="active">🧛‍♂️ Dracula</button></li>
          <li><button data-set-theme="cmyk" data-act-class="active">🖨 CMYK</button></li>
          <li><button data-set-theme="autumn" data-act-class="active">‍🍁 Autumn</button></li>
          <li><button data-set-theme="business" data-act-class="active">💼 Business</button></li>
          <li><button data-set-theme="acid" data-act-class="active">💊 Acid</button></li>
          <li><button data-set-theme="lemonade" data-act-class="active">🍋 Lemonade</button></li>
        </ul>
      </div>
    </div>
    <!-- /Themes -->

    <AuthBtn />


  </div>
</ul>
<!-- /Mobile Side Nav -->


<style>
  .mobile_nav_list {
    overflow-y: auto!important;
    top: 0!important;
    right: 0!important;
  }
</style>
