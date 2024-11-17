<!-- Reads a script and passes the data to it's children -->
<script lang="ts">
    import Dialogue from "./dialogue.svelte";
    import Background from "./background.svelte";
    import Choices from "./choices.svelte";
    import Profile from "./profile.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let dialogueNum = $state(0);
    let leftSpeaker = { src: "/favicon.png", name: "Test" };
    let rightSpeaker = { src: "/favicon.png", name: "Test2" };
    let dialogueText = $state("");
    let speakerName = $state("");
    let speakerPosition = $state("left");
    const nextDialogue = () => {
        dialogueNum++;
        dialogueText = data.script.dialogues[dialogueNum].text;
        speakerName = data.script.dialogues[dialogueNum].speakerName;
        speakerPosition = data.script.dialogues[dialogueNum].position;
    };
    const onKeyDown = (e: KeyboardEvent) => {
        console.log(e);
        switch (e.code) {
            case "Space":
                e.preventDefault();
                nextDialogue();
        }
    };
    nextDialogue();
</script>

<svelte:window on:keydown={onKeyDown} />

{#if speakerPosition === "left"}
    <Profile src="/favicon.png" name={speakerName} position="left" />
{:else}
    <Profile src="/favicon.png" name={speakerName} position="right" />
{/if}
<div class="box">
    <Dialogue text={dialogueText} name={speakerName} />
    <button onclick={nextDialogue}>Continue</button>
</div>
<Background src="/favicon.png" />

<style>
    .box {
        background-color: orange;
        position: absolute;
        box-sizing: border-box;
        bottom: 0;
        left: 0;
        width: calc(100% - 20px);
        height: 30%;
        border: 3px solid red;
        margin: 10px;
        padding: 10px 30px;
        border-radius: 15px;
    }
</style>
