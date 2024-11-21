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
    .box {
        display: flex;
        flex-direction: row;
        height: 30%;
    }
    button {
        border: 3px solid purple;
        background-color: rebeccapurple;
        border-radius: 10px;
        flex: 1 1 auto;
    }
</style>
