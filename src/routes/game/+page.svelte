<script lang="ts">
    import Scenarios from "./scenarios.svelte";
    let { data } = $props();
</script>

<div class="mainTitle">Archive</div>
<div class="back">
    <Scenarios scenarios={data.scenarios} />
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Special+Elite&display=swap");

    .back {
        opacity: 0.8;
        width: 100vw;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .mainTitle {
        position: sticky;
        top: 0;
        font-family: "Courier Prime", Arial, Helvetica, sans-serif;
        font-size: 10rem;
        text-align: center;
        font-weight: bold;
    }
</style>
