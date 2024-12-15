<script lang="ts">
    import { onMount } from "svelte";
    import type { Scenario } from "./proxy+page.server";
    let { scenarios }: { scenarios: Scenario[] } = $props();
    let scrollY = $state(0);
    // This is very poorly done and DOES NOT REFLECT the CSS that much
    // TODO: make it easier to refactor
    let cardHeight = $state(480);
    const GAP = 112;
    const EXTRA_RANDOM = 4; // some border shit that cardElement.clientHeight doesn't count
    const FINAL_HEIGHT = $derived(cardHeight + GAP + EXTRA_RANDOM);
    onMount(() => {
        const cardElement = document.querySelector(".card");
        if (cardElement) {
            cardHeight = cardElement.clientHeight; // Get the height of the card
        }
        // Load which files should be redacted (have a hidden description)
        scenarios.forEach((element) => {
            console.log(element.metadata.descriptionUnlockPath);
            if (element.metadata.descriptionUnlockPath !== undefined) {
                const data = localStorage.getItem(
                    "is_completed::" + element.metadata.descriptionUnlockPath,
                );
                // Convert it to a boolean if data exists
                element.descriptionUnlocked = data ? data === "true" : false;
            } else {
                element.descriptionUnlocked = true;
            }
        });
    });
</script>

<svelte:window bind:scrollY />
<div
    class="card-container"
    style="height:{FINAL_HEIGHT * (scenarios.length + 1)}px"
>
    {#each scenarios.toReversed() as scenario, i}
        <!-- The script searchParam is only used when it is not the default main.nsl (so just so the url looks nicer) -->
        <a
            href="/game/{scenario.dirName}{scenario.metadata.entrypoint !==
            'main.nls'
                ? `?script=${scenario.metadata.entrypoint}`
                : ''}"
            class="card {scrollY > 500 * (scenarios.length - i - 1) &&
            scrollY < 500 * (scenarios.length - i)
                ? 'card-active'
                : ''}"
            style="transform: translateX({(i / scenarios.length) *
                200}px) translateY({Math.min(
                scrollY,
                500 * (scenarios.length - i - 1),
            ) + i}px);"
        >
            <div class="title">{scenario.metadata.name}</div>
            <div class="text">
                <p
                    class="description {scenario.descriptionUnlocked
                        ? ''
                        : 'redacted'}"
                >
                    {scenario.metadata.description}
                </p>
                <p>Written by</p>
                <p class="author">
                    {scenario.metadata.author}
                </p>
                <p class="year">{scenario.metadata.year}</p>
            </div>
            {#if scenario.metadata.icon !== ""}
                <img
                    class="preview"
                    src="scenarios/{scenario.dirName}/{scenario.metadata.icon}"
                    alt="{scenario.dirName}/{scenario.metadata.icon}"
                />
            {/if}
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

    /* Enable the link and change the cursor to reflect that */
    .card-active {
        cursor: pointer !important;
        pointer-events: all !important;
    }
    .card-active .folder {
        transform: perspective(1000px) rotate3d(1, 0, 0, -200deg);
        opacity: 0;
    }
    .folder {
        width: 105%;
        height: 420px;
        margin: 5em auto 0;
        border-radius: 25px 5px 25px 25px;
        filter: drop-shadow(0 0 0.75rem grey);
        background: rgb(202, 171, 58);
        position: absolute;
        bottom: -10px;
        left: -10px;
        transform-origin: bottom;
        transition:
            transform 1000ms ease-out,
            opacity 1000ms ease-in-out;
        transform: perspective(1000px) rotate3d(1, 0, 0, 0deg);
        opacity: 1;
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
        padding-bottom: 300px; /* Extra padding to allow scrolling further */
        margin: 0;
        width: 100vw;
        gap: 10px;
    }

    .card {
        position: absolute;
        top: 300px;
        left: 0;
        width: 50%;
        min-height: 400px;
        height: 440px;

        background-color: #ffffff;
        background-image: url("/assets/textured-paper.png");
        border: 2px solid #ddd;
        border-radius: 8px 8px 50px 50px;
        padding: 20px;
        text-decoration: none;
        color: inherit;
        transition: box-shadow 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1;
        margin-top: 10px;
        scroll-snap-align: center;
        cursor: default;
        pointer-events: none;
    }

    .redacted {
        background-color: black;
        color: black;
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
