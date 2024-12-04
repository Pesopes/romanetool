<script lang="ts">
    import { calculateWordAnimationDelay } from "$lib/textUtils";
    import Dialogue from "../game/[scenario]/dialogue.svelte";

    let text = $state("");
    let textSpeed = $state(0);

    let delay = $derived(
        text
            .split(" ")
            .reduce(
                (delay, word) =>
                    delay +
                    (word === " "
                        ? 0
                        : calculateWordAnimationDelay(word, textSpeed)),
                0,
            ),
    );
</script>

<textarea bind:value={text}></textarea>
<input type="number" bind:value={textSpeed} step="0.01" />
<p>Result: {delay}ms</p>
<Dialogue name="TEST" {text} {textSpeed}></Dialogue>
