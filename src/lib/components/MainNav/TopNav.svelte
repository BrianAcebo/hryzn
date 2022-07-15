<script>
  import { user } from "$lib/stores/user";
  import { onMount } from 'svelte';
  import { themeChange } from 'theme-change';
  import { MoonIcon, ChevronLeftIcon, SearchIcon } from 'svelte-mono-icons';
  import AuthBtn from './AuthBtn.svelte';
  import UserNavIcons from './UserNavIcons.svelte';
  import { mainPage } from "$lib/stores/mainPage";


  onMount(() => {
    themeChange(false);
  })
</script>


<!-- Top Nav -->
<div class="fixed navbar bg-base-100 mb-40 shadow-xl px-12  main-top-nav z-50">


  <!-- Top Nav Left -->
  <div class="navbar-start md:flex hidden">


    {#if $mainPage.isMainPage}


    <!-- Searchbar -->
    <div class="flex w-64 justify-center items-center bg-transparent border-2 border-base-300 flex-row rounded-full drop-shadow-lg overflow-hidden">
      <input type="text" placeholder="Search for..." class="input input-ghost border-none w-3/4 m-0 text-white outline_none drop-shadow-none focus:drop-shadow-none" />

      <div class="w-1/4 flex justify-center items-center m-0">
        <label tabindex="0" class="cursor-pointer">
          <SearchIcon size="1.2x" class="icon_color" focusable="false" />
        </label>
      </div>
    </div>
    <!-- /Searchbar -->


    {:else}


    <!-- Chevron Left -->
    <a href="{$mainPage.mainPage}">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <ChevronLeftIcon size="1.5x" class="icon_color" focusable="false" />
      </label>
    </a>
    <!-- /Chevron Left -->


    {/if}


  </div>
  <!-- /Top Nav Left -->

  
  <!-- Top Nav Center -->
  <div class="navbar-center w-full md:w-auto text-center flex md:static justify-center">
    <a href="/" class="normal-case text-xl font-semibold tracking-wider flex flex-row items-center">Hryzn <h3 class="normal-case text-sm italic font-normal inline ml-2 tracking-normal">alpha</h3>
    </a>
  </div>
  <!-- Top Nav Center -->


  <!-- Top Nav Right -->
  <div class="navbar-end">
    <div class="flex justify-between items-center {$user ? 'w-3/5': 'w-60'}">


      {#if $user}
      <UserNavIcons />
      {/if}


      <AuthBtn />


      <!-- Themes -->
      <div class="dropdown dropdown-end md:static absolute right-5">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <MoonIcon size="1.5x" class="icon_color" focusable="false" />
        </label>

        <div class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px h-96 w-52 overflow-y-auto shadow-2xl mt-16 no_scrollbar">
          <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
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


    </div>
  </div>
  <!-- /Top Nav Right -->


</div>
<!-- /Top Nav -->
