<script>
    export let verse;
</script>


<a href="/v/{verse.slug}" class="w-[300px] block">
    <div class="w-full p-5 bg-base-300 h-[300px] rounded-box">
        <div class="w-full overflow-hidden relative rounded-box mb-5 h-[175px]">
            <div class="absolute w-full h-full bg-black opacity-25"></div>
        
            <div class="absolute bottom-0 w-full p-4 left-0">
                <h1 class="text-xl font-bold text-white">{verse.name}</h1>
            </div>
        
            {#if verse.image_url}
            <img src="https://zlawlqqgophieeqsticp.supabase.co/storage/v1/object/public/avatars/{verse.image_url}" class="w-full h-full object-center object-cover" alt="verse"/>
            {/if}
        </div>

        {#if verse.description}
        <p class="text-sm mb-5">{verse.description}</p>
        {/if}

        <p class="text-xs font-bold">{verse.members.length} member{verse.members.length > 1 ? 's' : ''}</p>
    </div>
</a>