<script lang="ts">
    let { name, text } = $props();
    // Parser custom script dialogue
</script>

<div class="box">
    <span class="name">{name}</span>: <span class="text">{text}</span>
</div>

<style>
    .box{
        background-color: orange;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30%;
        border: 3px solid red;
        margin: 5px;
        padding: 10px 30px;
        border-radius: 5px;
    }
    .text {
        font-family: 'Courier New', Courier, monospace;
    }
    
</style>