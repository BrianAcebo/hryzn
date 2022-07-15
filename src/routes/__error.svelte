<script context="module">
    export function load({ error, status }) {
        return {
            props: {
                message: error.message,
                status
            }
        };
    }
</script>


<script>
import Error from '$lib/components/Screens/Error.svelte'; // Show error
import PageNotFound from '$lib/components/Screens/PageNotFound.svelte'; // Show 404

export let message; // error msg
export let status; // error status
</script>


{#if status == 404}
<PageNotFound />
{:else}
<Error {message} {status} />
{/if}