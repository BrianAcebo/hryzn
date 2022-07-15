<svelte:head>
    <title>Find your people.</title>
    <meta property="og:title" name="og:title" content="Find your people." />
    <meta property="description" name="description" content="Hryzn is a social platform where communities can connect through niche topics." />
    <meta property="og:description" name="og:description" content="Hryzn is a social platform where communities can connect through niche topics." />
</svelte:head>


<div class="min-h-screen w-full bg-cover bg-center justify-center flex" style="background-image: url('/img/site/bg/hero1.png');">
    <div class="hero-overlay bg-opacity-60 bg_overlay"></div>

    <!-- Hero Text -->
    <div class="hero-content text-neutral-content w-full absolute top-[30%]">
        <div class="w-full lg:mx-12 mx-5 flex justify-center flex-col">
            <h1 class="mb-10 text-4xl md:text-6xl font-bold w-full text-center text-base-content">
                <span class="glitch" data-text="Find your passion">
                    Find your people.
                </span>
            </h1>

            <p class="my-10 text-xl font-bold text-white w-full text-center max-w-2xl mx-auto">Hryzn is a social platform where communities can connect through niche topics.</p>

            <label for="login-modal" class="btn btn-primary modal-button capitalize max-w-sm text-center mx-auto">Log In / Sign Up</label>
        </div>
    </div>
    <!-- /Hero Text -->
</div>


<style>
    .bg_overlay {
        background-color: hsl(var(--n) / 0.3);
    }

    .glitch {
    position: relative;
    margin: 0 auto;
    background: hsl(var(--b1));
    padding: 25px 50px;
    border-radius: 15px;
    }

    .glitch::before,
    .glitch::after {
    -webkit-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
    animation-direction: alternate-reverse;
    overflow: hidden;
    position: absolute;
    top: 25%;
    clip: rect(0, 900px, 0, 0);
    content: attr(data-text);
    }

    .glitch::after {
    -webkit-animation-name: glitch-animation;
            animation-name: glitch-animation;
    -webkit-animation-duration: 20s;
            animation-duration: 20s;
    left: 50px;
    text-shadow: -1px 0 hsl(var(--b3));
    background: hsl(var(--b1));
    }

    .glitch::before {
    -webkit-animation-name: glitch-animation-2;
            animation-name: glitch-animation-2;
    -webkit-animation-duration: 20s;
            animation-duration: 20s;
    left: 50px;
    text-shadow: 1px 0 hsl(var(--b2));
    background: hsl(var(--b1))
    }

    /* Expanded Animations */
    @-webkit-keyframes glitch-animation {
    0% {
        clip: rect(42px, 9999px, 44px, 0);
    }
    5% {
        clip: rect(12px, 9999px, 59px, 0);
    }
    10% {
        clip: rect(48px, 9999px, 29px, 0);
    }
    15.0% {
        clip: rect(42px, 9999px, 73px, 0);
    }
    20% {
        clip: rect(63px, 9999px, 27px, 0);
    }
    25% {
        clip: rect(34px, 9999px, 55px, 0);
    }
    30.0% {
        clip: rect(86px, 9999px, 73px, 0);
    }
    35% {
        clip: rect(20px, 9999px, 20px, 0);
    }
    40% {
        clip: rect(26px, 9999px, 60px, 0);
    }
    45% {
        clip: rect(25px, 9999px, 66px, 0);
    }
    50% {
        clip: rect(57px, 9999px, 98px, 0);
    }
    55.0% {
        clip: rect(5px, 9999px, 46px, 0);
    }
    60.0% {
        clip: rect(82px, 9999px, 31px, 0);
    }
    65% {
        clip: rect(54px, 9999px, 27px, 0);
    }
    70% {
        clip: rect(28px, 9999px, 99px, 0);
    }
    75% {
        clip: rect(45px, 9999px, 69px, 0);
    }
    80% {
        clip: rect(23px, 9999px, 85px, 0);
    }
    85.0% {
        clip: rect(54px, 9999px, 84px, 0);
    }
    90% {
        clip: rect(45px, 9999px, 47px, 0);
    }
    95% {
        clip: rect(37px, 9999px, 20px, 0);
    }
    100% {
        clip: rect(4px, 9999px, 91px, 0);
    }
    }
    @keyframes glitch-animation {
    0% {
        clip: rect(42px, 9999px, 44px, 0);
    }
    5% {
        clip: rect(12px, 9999px, 59px, 0);
    }
    10% {
        clip: rect(48px, 9999px, 29px, 0);
    }
    15.0% {
        clip: rect(42px, 9999px, 73px, 0);
    }
    20% {
        clip: rect(63px, 9999px, 27px, 0);
    }
    25% {
        clip: rect(34px, 9999px, 55px, 0);
    }
    30.0% {
        clip: rect(86px, 9999px, 73px, 0);
    }
    35% {
        clip: rect(20px, 9999px, 20px, 0);
    }
    40% {
        clip: rect(26px, 9999px, 60px, 0);
    }
    45% {
        clip: rect(25px, 9999px, 66px, 0);
    }
    50% {
        clip: rect(57px, 9999px, 98px, 0);
    }
    55.0% {
        clip: rect(5px, 9999px, 46px, 0);
    }
    60.0% {
        clip: rect(82px, 9999px, 31px, 0);
    }
    65% {
        clip: rect(54px, 9999px, 27px, 0);
    }
    70% {
        clip: rect(28px, 9999px, 99px, 0);
    }
    75% {
        clip: rect(45px, 9999px, 69px, 0);
    }
    80% {
        clip: rect(23px, 9999px, 85px, 0);
    }
    85.0% {
        clip: rect(54px, 9999px, 84px, 0);
    }
    90% {
        clip: rect(45px, 9999px, 47px, 0);
    }
    95% {
        clip: rect(37px, 9999px, 20px, 0);
    }
    100% {
        clip: rect(4px, 9999px, 91px, 0);
    }
    }
    @-webkit-keyframes glitch-animation-2 {
    0% {
        clip: rect(65px, 9999px, 100px, 0);
    }
    5% {
        clip: rect(52px, 9999px, 74px, 0);
    }
    10% {
        clip: rect(79px, 9999px, 85px, 0);
    }
    15.0% {
        clip: rect(75px, 9999px, 5px, 0);
    }
    20% {
        clip: rect(67px, 9999px, 61px, 0);
    }
    25% {
        clip: rect(14px, 9999px, 79px, 0);
    }
    30.0% {
        clip: rect(1px, 9999px, 66px, 0);
    }
    35% {
        clip: rect(86px, 9999px, 30px, 0);
    }
    40% {
        clip: rect(23px, 9999px, 98px, 0);
    }
    45% {
        clip: rect(85px, 9999px, 72px, 0);
    }
    50% {
        clip: rect(71px, 9999px, 75px, 0);
    }
    55.0% {
        clip: rect(2px, 9999px, 48px, 0);
    }
    60.0% {
        clip: rect(30px, 9999px, 16px, 0);
    }
    65% {
        clip: rect(59px, 9999px, 50px, 0);
    }
    70% {
        clip: rect(41px, 9999px, 62px, 0);
    }
    75% {
        clip: rect(2px, 9999px, 82px, 0);
    }
    80% {
        clip: rect(47px, 9999px, 73px, 0);
    }
    85.0% {
        clip: rect(3px, 9999px, 27px, 0);
    }
    90% {
        clip: rect(26px, 9999px, 55px, 0);
    }
    95% {
        clip: rect(42px, 9999px, 97px, 0);
    }
    100% {
        clip: rect(38px, 9999px, 49px, 0);
    }
    }
    @keyframes glitch-animation-2 {
    0% {
        clip: rect(65px, 9999px, 100px, 0);
    }
    5% {
        clip: rect(52px, 9999px, 74px, 0);
    }
    10% {
        clip: rect(79px, 9999px, 85px, 0);
    }
    15.0% {
        clip: rect(75px, 9999px, 5px, 0);
    }
    20% {
        clip: rect(67px, 9999px, 61px, 0);
    }
    25% {
        clip: rect(14px, 9999px, 79px, 0);
    }
    30.0% {
        clip: rect(1px, 9999px, 66px, 0);
    }
    35% {
        clip: rect(86px, 9999px, 30px, 0);
    }
    40% {
        clip: rect(23px, 9999px, 98px, 0);
    }
    45% {
        clip: rect(85px, 9999px, 72px, 0);
    }
    50% {
        clip: rect(71px, 9999px, 75px, 0);
    }
    55.0% {
        clip: rect(2px, 9999px, 48px, 0);
    }
    60.0% {
        clip: rect(30px, 9999px, 16px, 0);
    }
    65% {
        clip: rect(59px, 9999px, 50px, 0);
    }
    70% {
        clip: rect(41px, 9999px, 62px, 0);
    }
    75% {
        clip: rect(2px, 9999px, 82px, 0);
    }
    80% {
        clip: rect(47px, 9999px, 73px, 0);
    }
    85.0% {
        clip: rect(3px, 9999px, 27px, 0);
    }
    90% {
        clip: rect(26px, 9999px, 55px, 0);
    }
    95% {
        clip: rect(42px, 9999px, 97px, 0);
    }
    100% {
        clip: rect(38px, 9999px, 49px, 0);
    }
    }
</style>