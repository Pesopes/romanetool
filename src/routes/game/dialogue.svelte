<!-- Parses and displays script text -->
<script lang="ts">
    import { settings } from "$lib/settings";

    let {
        name,
        text,
        animplaying = $bindable(),
    }: { name: string; text: string; animplaying: boolean } = $props();

    const calculateWordAnimationDelay = (word: string) => {
        let specialDelay = 0;

        // Wait longer when unescaped "." or ","
        if (word.match(/(?<!\\)\./g)) {
            specialDelay = 300;
        } else if (word.match(/(?<!\\),/g)) {
            specialDelay = 100;
        }
        return word.length * 30 + 50 + specialDelay;
    };

    // let wordAnimationDelay = $state(0);
    let formattedText = $state("");
    // Parses special formatting symbols into html
    $effect(() => {
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
                    wordAnimationDelay += calculateWordAnimationDelay(word);
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
        };
    });

    let fontSizeCSS = $derived.by(() => {
        switch ($settings.fontSize) {
            case "small":
                return "1rem";
            case "medium":
                return "2rem";
            case "large":
                return "3rem";
        }
    });
</script>

<div style="--text-box-font-size:{fontSizeCSS}" class="box">
    <span class="name">{name}</span>:
    <span class="text">{@html formattedText}</span>
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
</style>
