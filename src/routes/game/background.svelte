<script lang="ts">
    import type { Background } from "./background";
    let { bg } : { bg : Background } = $props();
</script>

<div class="background" style="background-image: url({bg.src});"></div>

<style>
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        transition: opacity 0.3s ease-in-out;
        z-index: -1;
    }
</style>
