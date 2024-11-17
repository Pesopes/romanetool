<script lang="ts">
    import type { PageData } from './$types';
    import { fade } from "svelte/transition";
    
    let { data }: { data: PageData } = $props();
    
    let test = $state(4);
    let der = $derived(test*2);
     $effect(()=>{
        document.title = test.toString()
     })
</script>

<h1 transition:fade>{test}</h1>
<h2>{der}</h2>


<button onclick={()=>test++}>increment</button>
<p>{data.post.text}</p>