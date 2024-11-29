<!-- @component A dynamic amount of buttons with defined text. onchoose returns the id of the button clicked in the provided array. -->
<script lang="ts">
    import { onMount } from "svelte";
    import type { PromptInfo } from "./speaker";

    let {
        prompt,
        onchoose,
    }: { prompt: PromptInfo; onchoose: (i: number) => void } = $props();

    const promptSound = new Howl({
        src: ["/sounds/prompt.ogg"],
        volume: 0.7,
    });

    // Runs when the prompt appears
    onMount(() => {
        promptSound.play();
    });
</script>

<div class="box">
    {#each prompt.choices as choice, i}
        <button onclick={() => onchoose(i)}>{choice.answer}</button>
    {/each}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap");
    .box {
        display: flex;
        flex-direction: row;
        height: 30%;
    }
    button {
        font-family: "Courier Prime", monospace;
        font-size: clamp(
            0.6rem,
            4vw,
            1.5rem
        ); /* Dynamically scales font size */
        line-height: 1.2;
        border: 3px solid rgb(0, 0, 0);
        background-color: rgb(211, 144, 0);
        background: linear-gradient(135deg, #fb6107, #fb9107);
        border-radius: 10px;
        flex: 1 1 auto;
        margin: 5px;
        padding: 2px;
        transition-property: background-color box-shadow;
        transition-duration: 0.3s;
        transition-timing-function: ease-out;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        word-wrap: break-word; /* Ensures text wraps inside the button */
        letter-spacing: 0.5px;
    }
    button:hover {
        background-color: rgb(247, 187, 58);
        box-shadow: 5px 5px;
    }
    button:active {
        transform: scale(0.97);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3) inset;
    }
</style>
