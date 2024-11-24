<script>
    import { WebGlShader } from "svader";
    import { onMount } from "svelte";

    let { shaderCode } = $props();
    let width = $state(0);
    let height = $state(0);
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
    };
    onMount(resize);
</script>

<svelte:window onresize={resize} />
{#if shaderCode !== ""}
    <div class="shader-canvas">
        <WebGlShader
            width="{width}px"
            height="{height}px"
            code={shaderCode}
            parameters={[
                {
                    name: "u_resolution",
                    value: "resolution",
                },
                {
                    name: "u_offset",
                    value: "offset",
                },
                {
                    name: "u_time",
                    value: "time",
                },
            ]}
        >
            <div class="fallback">WebGL not supported in this environment.</div>
        </WebGlShader>
    </div>
{/if}

<style>
    .shader-canvas {
        position: absolute;
        overflow: hidden;
        margin: 0px;
        padding: 0px;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        z-index: -1;
    }
</style>
