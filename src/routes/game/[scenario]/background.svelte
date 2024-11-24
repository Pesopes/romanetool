<script lang="ts">
    import type { Background } from "./background";
    import Shader from "./shader.svelte";
    import { blur } from "svelte/transition";
    let { bg }: { bg: Background } = $props();
    import { settings } from "$lib/settings";
    $effect(() => {
        // if music is disabled
        if (!$settings.music) return;

        let a: HTMLAudioElement = new Audio();
        a.src = bg.ambientMusic;
        a.load();
        a.play();
        return () => {
            a.pause();
        };
    });
</script>

<div class="background" style="background-color:black"></div>
{#key bg.src}
    <div
        transition:blur
        class="background"
        style="background-image: url({bg.src});"
    ></div>
{/key}

<div class="shader"><Shader shaderCode={bg.shaderCode}></Shader></div>

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
        z-index: -2;
    }

    .shader {
        z-index: -1;
    }
</style>
