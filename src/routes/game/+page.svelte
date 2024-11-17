<!-- Reads a script and passes the data to it's children -->
<script lang="ts">
    import Dialogue from "./dialogue.svelte";
    import Background from "./background.svelte";
    import Choices from "./choices.svelte";
    import Profile from "./profile.svelte";
    import type { PageData } from "./$types";
    import type { SpeakerProfile } from "./proxy+page";

    let { data }: { data: PageData } = $props();
    let dialogueNum = $state(0);

    let profilePositions = ["left", "right"];
    let speakerProfiles: SpeakerProfile[] = $state([
        { speaker: { name: "", image: "/favicon.png" }, active: false },
        { speaker: { name: "", image: "/favicon.png" }, active: false },
    ]);

    let dialogueText = $derived(data.script.dialogues[dialogueNum].text);
    let speakerName = $derived(data.script.dialogues[dialogueNum].speaker.name);

    const updateSpeakerProfile = () => {
        // Update speaker profile
        for (var p of speakerProfiles) {
            p.active = false;
        }
        let id = profilePositions.indexOf(
            data.script.dialogues[dialogueNum].position,
        );
        speakerProfiles[id] = {
            speaker: data.script.dialogues[dialogueNum].speaker,
            active: true,
        };
    };

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const nextDialogue = () => {
        // Move to next dialog
        dialogueNum++;
        updateSpeakerProfile();
    };
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case "Space":
                e.preventDefault();
                nextDialogue();
        }
    };
    updateSpeakerProfile();
</script>

<svelte:window on:keydown={onKeyDown} />

{#each profilePositions as profilePosition, i (profilePosition)}
    <Profile
        src={speakerProfiles[i].speaker.image}
        name={speakerProfiles[i].speaker.name}
        position={profilePosition}
        active={speakerProfiles[i].active}
    />
{/each}

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
