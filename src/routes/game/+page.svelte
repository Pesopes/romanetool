<script lang="ts">
    let { data } = $props();
</script>

{#each data.scenarios as scenario}
    <!-- The script searchParam is only used when it is not the default main.nsl (so just so the url looks nicer) -->
    <a
        href="/game/{scenario.dirName}{scenario.metadata.entrypoint !==
        'main.nls'
            ? `?script=${scenario.metadata.entrypoint}`
            : ''}">{scenario.metadata.name}</a
    >
    <p>{scenario.metadata.description}</p>
    <p>Made by: {scenario.metadata.author}</p>
    <img
        src="scenarios/{scenario.dirName}/{scenario.metadata.icon}"
        alt="An icon for the scenario"
    />
{/each}
