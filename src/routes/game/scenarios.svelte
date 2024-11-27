<script lang="ts">
    import type { Scenario } from "./proxy+page.server";
    let { scenarios }: { scenarios: Scenario[] } = $props();
    let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />
<div class="card-container">
    {#each scenarios as scenario, i}
        <a
            href="/game/{scenario.dirName}{scenario.metadata.entrypoint !==
            'main.nls'
                ? `?script=${scenario.metadata.entrypoint}`
                : ''}"
            class="card"
            style="transform: translateX({10 * i - scrollY / 50}px)"
        >
            <!-- <div class="file-top-main">hello</div> -->
            <!-- The script searchParam is only used when it is not the default main.nsl (so just so the url looks nicer) -->

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
            <img
                class="preview"
                src="scenarios/{scenario.dirName}/{scenario.metadata.icon}"
                alt="{scenario.dirName}/{scenario.metadata.icon}"
            />
            <!-- <img
                class="file-top"
                src="/icons/file-top.svg"
                alt="the top of a file"
            /> -->
            <div class="folder"></div>
        </a>
    {/each}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Special+Elite&display=swap");

    .file-top {
        position: absolute;
        left: 0px;
        top: 0%;
        width: 100px;
        height: 100%;
    }
    @keyframes flip {
        0% {
            transform: perspective(1000px) rotate3d(1, 0, 0, 0deg)
                translateY(0px);
        }
        50% {
            transform: perspective(1000px) rotate3d(1, 0, 0, -180deg);
        }

        100% {
            transform: perspective(1000px) rotate3d(1, 0, 0, -300deg);
            opacity: 0;
        }
    }
    .card:hover .folder,
    .card:focus-within .folder {
        animation: flip 1s ease-out forwards;
    }
    .folder {
        width: 105%;
        height: 350px;
        margin: 5em auto 2em;
        border-radius: 25px 5px 25px 25px;
        filter: drop-shadow(0 0 0.75rem grey);
        background: rgb(202, 171, 58);
        position: absolute;
        top: 10px;
        left: -10px;
        transform-origin: bottom;
    }
    /* Source: https://stackoverflow.com/questions/71550110/is-it-possible-to-achieve-a-folder-shape-div-container-using-css */
    .folder::before {
        content: "";
        position: absolute;
        top: -18px;
        right: 0;
        width: 200px;
        height: 25px;
        background: rgb(202, 171, 58);
        border-radius: 0 25px 0 0;
        clip-path: path("M200 0H40c-25 2-15 16-40 18L200 100Z");
    }

    .card-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        min-height: 100vh;
        padding: 1rem 0;
        padding-bottom: 400px; /* Extra padding to allow scrolling further */
        margin: 0;
        width: 100vw;
        gap: 10px;
    }

    .card {
        position: sticky;
        top: 200px;
        left: 0;
        width: 50%;
        min-height: 400px;
        background-color: #fff;
        border: 2px solid #ddd;
        border-radius: 8px 8px 50px 50px;
        padding: 20px;
        text-decoration: none;
        color: inherit;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1;
        margin-top: 10px;
        scroll-snap-align: center;
        height: 8vh;
    }

    .card:hover {
        transform: translateX(10px) translateY(-10px); /* Pull out effect */
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

    .preview {
        max-height: 50%;
        object-fit: cover;
    }
</style>
