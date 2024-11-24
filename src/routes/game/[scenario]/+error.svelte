<script>
    import { page } from "$app/stores";
    import Dialogue from "./dialogue.svelte";
</script>

<div>
    <Dialogue
        text={$page.error?.message || "Undefined error"}
        name={$page.status.toString()}
    />
</div>

<style>
    div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 200px;
        background-color: rebeccapurple;
    }
</style>
