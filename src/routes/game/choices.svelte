<script lang="ts">
    import type { PromptInfo } from "./speaker";

    let {
        prompt,
        onchoose,
    }: { prompt: PromptInfo; onchoose: (i: number) => void } = $props();
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
        font-size: 2rem;
        border: 3px solid rgb(0, 0, 0);
        background-color: rgb(211, 144, 0);
        border-radius: 10px;
        flex: 1 1 auto;
        margin: 5px;
        padding: 2px;
        transition-property: background-color box-shadow;
        transition-duration: 0.3s;
        transition-timing-function: ease-out;
    }

    button:hover {
        background-color: rgb(247, 187, 58);
        box-shadow: 5px 5px;
    }
</style>
