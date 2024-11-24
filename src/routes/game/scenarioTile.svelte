<script lang="ts">
    import type { Scenario } from "./proxy+page.server";
    let { scenario }: { scenario: Scenario } = $props();
</script>

<a
    href="/game/{scenario.dirName}{scenario.metadata.entrypoint !== 'main.nls'
        ? `?script=${scenario.metadata.entrypoint}`
        : ''}"
    class="link"
>
    <div class="box">
        <!-- The script searchParam is only used when it is not the default main.nsl (so just so the url looks nicer) -->
        <img
            class="preview"
            src="scenarios/{scenario.dirName}/{scenario.metadata.icon}"
            alt="{scenario.dirName}/{scenario.metadata.icon}"
        />
        <div class="text">
            <div class="title">{scenario.metadata.name}</div>

            <div class="description">{scenario.metadata.description}</div>
        </div>
        <div class="author">Made by: {scenario.metadata.author}</div>
    </div>
</a>

<style>
    .link {
        position: relative;
        text-decoration: none;
        color: white;
    }
    .link:visited {
        color: rgb(255, 255, 255);
    }
    .link:hover {
        color: rgb(255, 251, 251);
    }
    .box {
        font-family: Arial, Helvetica, sans-serif;
        --width: 50vw;
        --height: 30vh;
        width: var(--width);
        height: var(--height);
        --margin: 10px;
        margin: var(--margin);
        padding: 10px;
        background-color: black;
        border-radius: calc(var(--width) / 30);
    }
    .text {
        font-family: Arial, Helvetica, sans-serif;
        position: relative;
        left: calc(var(--width/30));
        width: calc(var(--width) / 2);
    }
    .title {
        width: calc(var(--width) / 1.5);
        font-size: 3rem;
        font-weight: bold;
        border-bottom: solid white 5px;
    }
    .description {
        width: calc(var(--width) / 2);
    }
    .author {
        position: absolute;
        width: calc(var(--width) / 2);
        left: calc(var(--margin) * 2);
        bottom: calc(var(--margin) * 2);
    }

    .preview {
        position: absolute;
        left: calc(var(--width) / 2 + var(--margin));
        width: calc(var(--width) / 2);
        height: var(--height);
        mask-image: linear-gradient(-45deg, white, transparent);
        border-radius: calc(var(--width) / 30);
    }
</style>
