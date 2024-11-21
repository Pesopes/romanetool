<script lang="ts">
    import type { PromptInfo } from "./speaker";

    let {
        prompt,
        onchoose,
    }: { prompt: PromptInfo; onchoose: (i: number) => void } = $props();
</script>

{#each prompt.choices as choice, i}
    <button onclick={() => onchoose(i)}>{choice.answer}</button>
{/each}
