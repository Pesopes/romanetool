<!-- @component Parses and displays script text with a nice animation -->
<script lang="ts">
    import { convertFontSizeSetting, settings } from "$lib/settings";
    import { fade } from "svelte/transition";
    import { Howl } from "howler";
    import { calculateWordAnimationDelay } from "$lib/textUtils";

    let {
        name,
        text,
        textSpeed = 1,
        animplaying = $bindable(),
    }: {
        name: string;
        text: string;
        textSpeed: number;
        animplaying?: boolean;
    } = $props();

    // Pooled because more play at once
    const beep = new Howl({
        src: ["/sounds/beep.ogg"],
        pool: 5,
        volume: 0.3,
    });

    // Parse settings strings into CSS font-size
    let fontSizeCSS = $derived(convertFontSizeSetting($settings.fontSize));

    let formattedText = $state(""); // This is the text shown in game
    // Parses special formatting symbols into html
    $effect(() => {
        const beepTimeouts: ReturnType<typeof setTimeout>[] = [];
        // accumulate animation-delay to animate the words appearing gradually
        let wordAnimationDelay = 0;
        formattedText = text
            .split(/(\s+)/)
            .map((word) => {
                if (word === " ") {
                    return word; // Return spaces as they are
                } else {
                    // The word before dictates how long it should wait
                    const html = `<span class="word" style="animation-delay: ${wordAnimationDelay}ms">${word}</span>`;
                    beepTimeouts.push(
                        setTimeout(() => {
                            if ($settings.sounds) beep.play();
                        }, wordAnimationDelay),
                    );
                    wordAnimationDelay += calculateWordAnimationDelay(
                        word,
                        textSpeed,
                    );
                    return html;
                }
            }) // Animate the words appearing gradually
            .join(" ")
            .replace(/\\\./g, ".") // Replace escaped "."
            .replace(/\\,/g, ".") // Replace escaped ","
            .replace(/\*(.*?)\*/g, "<span class='bold'>$1</span>") // *...* is bold
            .replace(/_(.*?)_/g, "<span class='italic'>$1</span>") // _..._ is italic
            .replace(/~(.*?)~/g, "<del>$1</del>") // ~...~ is strikethrough
            .replace(/\n/g, "<br/>") // \n into
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
            })
            .replace(/{(.*?)}/g, "<img src=$1 />"); // Replace {imgpath} with img element

        // Don't set timeout if onanimationend is not defined
        let animationEndTimeout: ReturnType<typeof setTimeout> | null = null;

        animplaying = true;
        animationEndTimeout = setTimeout(() => {
            animplaying = false;
        }, wordAnimationDelay);

        // Remove timer when new dialogue is in
        return () => {
            clearTimeout(animationEndTimeout);
            beepTimeouts.forEach((timeout) => clearTimeout(timeout));
        };
    });
</script>

<div style="--text-box-font-size:{fontSizeCSS}" class="box">
    <span class="name">{name}</span>:
    <span class="text">{@html formattedText}</span>
    {#if !animplaying}
        <div in:fade class="blinker">></div>
    {/if}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap");
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
    @keyframes -global-fade-in-text {
        100% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }
    .box {
        font-size: var(--text-box-font-size);
        transition: font-size ease-in-out 300ms;
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

        img {
            height: var(--text-box-font-size);
            border-radius: 100%; /* Makes it circular */
            border: 2px solid black;
            background-color: white;
            transition: all 100ms ease-in-out;
        }
        img:hover {
            scale: 4;
        }

        .word {
            display: inline-block;
            opacity: 0;
            transform: translateY(-10px) scale(0.9);

            animation: fade-in-text 0.5s cubic-bezier(0.2, 1.12, 0.27, 0.94)
                forwards;
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

    .name {
        font-family: "Courier Prime", monospace;
        font-weight: bold;
    }
    .text {
        font-family: "Courier Prime", monospace;
    }

    @keyframes blinking {
        50% {
            opacity: 0;
        }
    }
    .blinker {
        animation: blinking 0.75s 400ms ease-out infinite;
    }
</style>
