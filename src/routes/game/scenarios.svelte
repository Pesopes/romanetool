<script lang="ts">
    import type { Scenario } from "./proxy+page.server";
    let { scenarios }: { scenarios: Scenario[] } = $props();
</script>

<div class="card-container">
    {#each scenarios as scenario, i}
        <a
            href="/game/{scenario.dirName}{scenario.metadata.entrypoint !==
            'main.nls'
                ? `?script=${scenario.metadata.entrypoint}`
                : ''}"
            class="card"
            style="top: {i * 50}px;"
        >
            <img class="file-top" src="icons/file-top.svg" />
            <div class="file-top"></div>
            <!-- The script searchParam is only used when it is not the default main.nsl (so just so the url looks nicer) -->
            <!--<img
                    class="preview"
                    src="scenarios/{scenario.dirName}/{scenario.metadata.icon}"
                    alt="{scenario.dirName}/{scenario.metadata.icon}"
                /> -->
            <div class="title">{scenario.metadata.name}</div>
            <div class="text">
                <p class="description">
                    {scenario.metadata.description}
                </p>
                <p>Written by</p>
                <p class="author">
                    {scenario.metadata.author}
                </p>
                <p class="year">{scenario.metadata.year}</p>
            </div>
        </a>
    {/each}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Special+Elite&display=swap");

    .file-top {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .card-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem 0;
        margin: 0;
        width: 50vw;
        gap: 10px;
    }

    .card {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 500px;
        background-color: #fff;
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        text-decoration: none;
        color: inherit;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1;
        margin-top: 10px;
    }

    .card:nth-child(n) {
        z-index: n;
    }

    .card:hover {
        transform: translateX(10px) translateY(-10px); /* Pull out effect */
        z-index: 50;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .title {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
        font-family: "Special Elite", system-ui;
    }
    .text {
        color: #333;
        font-family: "Special Elite", system-ui;
    }
    .text p {
        text-align: center;
        font-size: 0.9rem;
    }
    .year {
        text-align: right !important;
    }

    .description {
        margin-bottom: 15px;
    }

    .author {
        font-size: 12px;
        color: #777;
        text-align: center;
    }
</style>
