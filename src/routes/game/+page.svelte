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
<Dialogue text="toto je test psaní, kde je vše zajímavý" name="Sherlock"/>
<Background src="/favicon.png"/>

