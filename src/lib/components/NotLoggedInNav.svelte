<script>
	import CtaButton from "$lib/components/site/CtaButton.svelte";

  let openNav = false;
</script>

<header class="not-logged-in-nav fixed top-0 left-0 right-0 w-full p-4 z-10 max-w-7xl m-auto z-20">
  <nav class="flex justify-between items-center w-full">
    <div class="flex flex-row">
      <a href="/" class="logo mr-10">
        <img src="/images/hryzn-text-logo-white.svg" alt="logo" class="w-full h-auto" />
      </a>

      <div aria-label="mobile menu" class="nav-toggle" class:open="{openNav}" on:click={() => openNav = !openNav}>
        <span></span>
        <span></span>
        <span></span> 
      </div>

      <ul class="menu-left list-none p-0 m-0 md:top-0 top-28 md:static absolute flex md:flex-row flex-col md:justify-center justify-start items-center" class:collapse="{openNav}">
        <li><a href="#about" on:click={() => openNav = false}>about</a></li>
        <li><a href="#exp" on:click={() => openNav = false}>resume</a></li>
        <li><a href="#skills" on:click={() => openNav = false}>skills</a></li>
      </ul>
    </div>

    <div class="flex felx-row justify-center items-center">
      <a href="/" class="text-white mr-10">watch video</a>
      <CtaButton text="get early access" link="/" bg_color="#7b39b8" />
    </div>
  </nav>
</header>

<style lang="scss">
  .not-logged-in-nav {
    will-change: transform;
    transition: background 0.3s, -webkit-transform 0.5s cubic-bezier(0.694, 0.048, 0.335, 1);
    transition: transform 0.5s cubic-bezier(0.694, 0.048, 0.335, 1), background 0.3s;
    transition: transform 0.5s cubic-bezier(0.694, 0.048, 0.335, 1), background 0.3s, -webkit-transform 0.5s cubic-bezier(0.694, 0.048, 0.335, 1);
    transform: translateY(0);
    -webkit-transform: translateY(0);

  .logo img {
    max-width: 100px;
  }

  .menu-left a {
    display: inline-block;
    position: relative;
    padding-bottom: 0px;
    transition: color .35s ease;
    margin: 0 15px;
    color: #fff;
  }

  .menu-left a:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    transition: width 0s ease, background .35s ease;
  }

  .menu-left a:after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background: #fff;
    transition: width .35s ease;
  }

  .menu-left a:hover:before {
    width: 100%;
    background: #fff;
    transition: width .35s ease;
  }

  .menu-left a:hover:after {
    width: 100%;
    background: transparent;
    transition: all 0s ease;
  }
  
  header nav ul li {
    float: none;
    margin-left: 0;
  }
  @media (min-width: 768px) {
    header nav ul li {
      float: left;
      margin-left: 1rem;
    }
  }
  header nav ul li a {
    display: block;
  }
  @media (min-width: 576px) {
    header nav ul li a {
      display: block;
      padding: .425rem 0rem;
    }
  }
  
  @media (max-width: 768px) {
    ul {
      clear: both;
    }
    ul li {
      padding: .5em 0;
    }
  }
  .hide-nav {
    transform: translateY(-120%) !important;
    -webkit-transform: translateY(-120%) !important;
  }
  
  ul.menu-left {
    max-height: 0;
    overflow: hidden;
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
    z-index: 10;
  }
  @media (min-width: 768px) {
    ul.menu-left {
      float: right;
      max-height: none;
    }
  }
  ul.menu-left:before {
    content: '';
    display: table;
    clear: both;
  }
  ul.menu-left.collapse {
    max-height: 15em !important;
  }
  
  .nav-toggle {
    display: block;
    border-radius: 5px;
    background-color: transparent;
    float: right;
    height: 38px;
    width: 38px;
    cursor: pointer;
    padding: 8px 8px;
  }
  .nav-toggle.open span:first-child {
    transform: rotate(45deg) translate(4.4px, 4.4px);
  }
  .nav-toggle.open span:nth-child(2) {
    width: 0%;
    opacity: 0;
  }
  .nav-toggle.open span:last-child {
    transform: rotate(-45deg) translate(4.4px, -4.4px);
  }
  @media (min-width: 768px) {
    .nav-toggle {
      display: none;
    }
  }
  .nav-toggle span {
    position: relative;
    display: block;
    height: 2px;
    width: 100%;
    margin-top: 4px;
    background-color: #000;
    transition: all .25s;
  }
}
</style>