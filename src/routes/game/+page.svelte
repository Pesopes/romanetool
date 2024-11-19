<!-- Reads a script and passes the data to it's children -->
<script lang="ts">
    import Dialogue from "./dialogue.svelte";
    import Background from "./background.svelte";
    import Profile from "./profile.svelte";
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();

    // Just shorthands
    let speakerProfiles = $derived(data.script.manager.speakers);
    let dialogueContext = $derived(data.script.manager.currentDialogue);
    let background = $derived(data.script.manager.background)

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case "Space":
                e.preventDefault();
                data.script.manager.runNextEvent();
        }
    };
</script>

<svelte:window on:keydown={onKeyDown} />

{#each speakerProfiles as [codename, speakerProfile] (codename)}
    {#if speakerProfile.position !== "none"}
        <Profile
            src={speakerProfile.image}
            name={speakerProfile.name}
            position={speakerProfile.position}
            active={speakerProfile.active}
        />
    {/if}
{/each}

<div class="box">
    <Dialogue text={dialogueContext.text} name={dialogueContext.speakerName} />
    <!-- <button onclick={nextDialogue}>Continue</button> -->
</div>
<Background bg={background} />

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
