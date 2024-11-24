<script lang="ts">
    import ScenarioTile from "./scenarioTile.svelte";
    let { data } = $props();
</script>

<div class="mainTitle">Hry</div>

<div class="scenarios">
    {#each data.scenarios as scenario}
        <!-- The script searchParam is only used when it is not the default main.nsl (so just so the url looks nicer) -->
        <ScenarioTile {scenario}></ScenarioTile>
    {/each}
</div>

<style>
    .mainTitle {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10rem;
        text-align: center;
    }
    .scenarios {
        width: 80vw;
        margin-left: 10vw;
        margin-right: 10vw;
    }
</style>
