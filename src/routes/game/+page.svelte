<script lang="ts">
    import Dialogue from "./dialogue.svelte";
    import Background from "./background.svelte";
    import Choices from "./choices.svelte";
    import Profile from "./profile.svelte";
    // Main game handler
    // Reads the script and passes it to it's children

</script>

<Profile src="/favicon.png" name="Sherlock" position="left"/>
<Profile src="/favicon.png" name="Poirot" position="right"/>
<div class="box">
    <Dialogue text="toto je %test psaní%, kde je *vše* _zajímavý_. ~OHOHOHOOHO~ je to strašně dlouhý takže pořád píšu dál alalalalalalalalal něco % dasdaskjd laskdjaklsdj kasldj askldj lkasjdlk jas%" name="Sherlock"/>
    <button>Continue</button>
</div>
<Background src="/favicon.png"/>

<style>
    .box {
        background-color: orange;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 30%;
        border: 3px solid red;
        margin: 5px;
        padding: 10px 30px;
        border-radius: 5px;
    }
</style>