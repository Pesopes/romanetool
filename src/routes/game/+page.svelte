<script lang="ts">
    // export const csr = false; //Maybe not needed idk
    let { data } = $props();
    let subdirectories = $derived(data.subdirectories);
</script>

{#each subdirectories as subdir}
    <a href="/game/{subdir}">{subdir}</a>
{/each}
