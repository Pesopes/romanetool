<script lang="ts">
    let { name, text }: { name: string; text: string } = $props();
    // Parser custom script dialogue


    // Parses special formatting symbols into html
    let formattedText = $derived.by(() => {
        return text
            .replace(/\*(.*?)\*/g, "<span class='bold'>$1</span>")
            .replace(/_(.*?)_/g, "<span class='italic'>$1</span>")
            .replace(/~(.*?)~/g, "<del>$1</del>")
            .replace(/%(.*?)%/g, (match, p1) => {
                // Wrap each character in the wavy span
                // Wrap the entire %...% content in a <span class="wave"> tag
                return `<span class="wave">
                        ${p1
                            .split("")
                            .map((char: string, i: number) => {
                                if (char === " ") {
                                    return char; // Return spaces as they are
                                } else {
                                    return `<span class="wavy" style="animation-delay: ${i * 50}ms">${char}</span>`;
                                }
                            })
                            .join("")}
                    </span>`;
            });
    });
</script>

<div class="box">
    <span class="name">{name}</span>:
    <span class="text">
        <span class="wave">
            {#each "tototh jkaskld js".split("") as char, i}
                <span style="animation-delay: {i * 0.1}s">{char}</span>
            {/each}
        </span>
        {@html formattedText}</span
    >
</div>

<style>
    /* Globally defined because of @html injection scoping */
    @keyframes -global-up-down-text {
        0%,
        100% {
            transform: translateY(-4px); /* No movement at start and end */
        }
        50% {
            transform: translateY(4px); /* Move up slightly */
        }
    }
    .box :global {
        .bold {
            font-weight: bold;
        }
        .italic {
            font-style: italic;
        }
        del {
            text-decoration: line-through;
            opacity: 0.65;
        }
        .wave :global {
            display: inline-block; /* Ensures the text stays inline */
        }

        .wavy {
            display: inline-block; /* Treat each character as a block for independent animation */
            animation: up-down-text 1.5s ease-in-out infinite;
            transform-origin: bottom; /* Make the wave effect pivot from the bottom of the character */
        }
    }

    .box {
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
    .name {
        font-weight: bold;
    }
    .text {
        font-family: "Courier New", Courier, monospace;
    }
</style>
