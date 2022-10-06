<script>
    export let text;
    export let bg_color;
    export let link;
</script>

<a href="{ link }" class="cta-btn text-white py-4 px-8" style="background: { bg_color }">{ text }</a>

<style>
    .cta-btn {
        position: relative;
        border-radius: 0% 0% 0% 0% / 0% 0% 0% 0% ;
        box-shadow: 8px 8px #fff;
        transition: all .4s ease;
        display: block;
        max-width: 200px;
        text-align: center;
    }

    .cta-btn:hover {
        border-radius: 0% 0% 50% 50% / 0% 0% 5% 5% ;
        box-shadow: 5px 5px #fff;
    }
</style>