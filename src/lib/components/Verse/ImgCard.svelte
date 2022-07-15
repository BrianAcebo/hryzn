<script>
    // Component props passed over
    export let image_url;
</script>


<img class="w-full h-full object-center mx-auto" src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{image_url}" alt="Verse" />


<style>

    /* UI Loading Skeleton */
    img:empty {
        background: 
            linear-gradient(0.25turn, transparent, hsl(var(--b2)), transparent),
            linear-gradient(hsl(var(--b1)), hsl(var(--b1)));
        background-repeat: no-repeat;
        background-size: cover;
        background-position: -315px 0, 0 0, 0px 190px, 50px 195px; 
        animation: loading 1.5s infinite;
    }

    @keyframes loading {  
        to {
            background-position: 315px 0, 0 0, 0 190px, 50px 195px;
        }
    }
</style>