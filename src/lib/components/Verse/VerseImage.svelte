<script>
    import { supabase } from "$lib/utils/supabase";
    import { onMount } from 'svelte';


    // Component props passed over
    export let name;
    export let image_url;


    // Image url from supabase storage
    let verse_image;
    onMount(async () => {
        const { data, error } = supabase.storage.from('avatars').getPublicUrl(image_url);
        verse_image = data.publicURL;
    });
</script>


<div class="h-64 w-full overflow-hidden relative rounded-box">
    <div class="absolute w-full h-full bg-black opacity-25"></div>

    <div class="absolute bottom-10 w-full p-4 text-center">
      <h1 class="text-xl text-center font-bold text-white">{name}</h1>
    </div>

    <img src="{image_url == null ? 'https://picsum.photos/500/800' : verse_image}" class="w-full h-full object-center object-cover" />
</div>