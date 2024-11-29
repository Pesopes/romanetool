<!-- Reads a script and passes the data to it's children -->
<script lang="ts">
    import Dialogue from "./dialogue.svelte";
    import Background from "./background.svelte";
    import Profile from "./profile.svelte";
    import type { PageData } from "./$types";
    import Choices from "./choices.svelte";
    import { onMount } from "svelte";
    import Overlay from "./overlay.svelte";
    import Topbar from "./topbar.svelte";
    let { data }: { data: PageData } = $props();

    // Just shorthands
    let speakerProfiles = $derived(data.script.manager.speakers);
    let dialogueContext = $derived(data.script.manager.currentDialogue);
    let currentPrompt = $derived(data.script.manager.currentPrompt);
    let background = $derived(data.script.manager.background);
    let isBlocked = $derived(data.script.manager.isBlocked);
    // Binded to <Dialogue>, passed to <Profile>
    let speaking = $state(false);
    // Unblocks events after speaking
    $effect(() => {
        if (!speaking) {
            data.script.manager.stopSpeaking();
        }
    });

    // Space to run next event
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case "Space":
                e.preventDefault();
                data.script.manager.runNextEvent();
        }
    };
    // Run the first event automatically
    onMount(() => {
        data.script.manager.runNextEvent();
    });
</script>

<svelte:window on:keydown={onKeyDown} />

<Background bg={background} />

<div class="profiles">
    {#each speakerProfiles as [codename, speakerProfile] (codename)}
        <Profile
            src={speakerProfile.image}
            name={speakerProfile.name}
            position={speakerProfile.position}
            active={speakerProfile.active}
            {speaking}
        />
    {/each}
</div>
<div
    class="box {isBlocked ? 'blocked' : 'active'}"
    onpointerdown={() => data.script.manager.runNextEvent()}
>
    {#if dialogueContext.text !== ""}
        <Dialogue
            text={dialogueContext.text}
            name={dialogueContext.speakerName}
            bind:animplaying={speaking}
        />
        {#if currentPrompt}
            <Choices
                prompt={currentPrompt}
                onchoose={data.script.manager.choosePrompt.bind(
                    data.script.manager,
                )}
            />
        {/if}
    {/if}
</div>
<!-- Clicking on the dialogue box runs next event -->
<div onpointerdown={() => data.script.manager.runNextEvent()}>
    <Overlay overlay={data.script.manager.overlay}></Overlay>
</div>
<Topbar />

<style>
    .profiles {
        position: absolute;
        height: 20%;
        bottom: 30%;
        margin: 10px;
        left: 0px;
        width: calc(100% - 20px);
    }
    .box {
        background-color: #b1f1fbe5;
        background-image: url("/assets/textured-paper.png");

        position: absolute;
        box-sizing: border-box;
        overflow-y: scroll;
        bottom: 0;
        left: 0;
        width: calc(100% - 20px);
        height: 30%;
        border: 3px solid #3f7cab;
        margin: 10px;
        padding: 10px 30px;
        border-radius: 15px;
        scrollbar-width: none;
    }
    .active {
        cursor: pointer;
    }
    .blocked {
        cursor: not-allowed;
    }
</style>
