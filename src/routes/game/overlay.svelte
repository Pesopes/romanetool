<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Overlay } from "./background";
    let { overlay }: { overlay: Overlay } = $props();
</script>

{#if overlay.visible}
    <div transition:fade={{ duration: 5000 }} class="overlay">
        <h1 class="title">{overlay.title}</h1>
        <h2 class="subtitle">{overlay.subtitle}</h2>
    </div>
{/if}

<style>
    .title {
        background-clip: text;
        color: white;
        font-size: 10rem;
        user-select: none;
    }
    .subtitle {
        background-clip: text;
        color: white;
        font-size: 5rem;
        user-select: none;
    }
    .overlay {
        mask-size: 100%;
        background-color: black;
        position: absolute;
        text-align: center;
        vertical-align: center;
        left: 0px;
        top: 0px;
        width: 100vw;
        height: 100vh;
        margin: 0px;
        padding: 0px;
        z-index: 220;
        transition: opacity cubic-bezier(0.075, 0.82, 0.165, 1) 5s;
    }
</style>
