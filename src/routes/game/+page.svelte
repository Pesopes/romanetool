<script lang="ts">
    import Scenarios from "./scenarios.svelte";
    let { data } = $props();
</script>

<div class="mainTitle">Hry</div>
<Scenarios scenarios={data.scenarios} />

<style>
    .mainTitle {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10rem;
        text-align: center;
    }
</style>
