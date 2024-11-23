<script lang="ts">
    import { settings } from "$lib/settings";

    // Dumb but works
    function cycleFontSizes() {
        let size = $settings.fontSize;
        if (size === "small") {
            $settings.fontSize = "medium";
        } else if (size === "medium") {
            $settings.fontSize = "large";
        } else if (size === "large") {
            $settings.fontSize = "small";
        }
    }
</script>

<div class="bar">
    <a href="/" class="back" aria-label="Go back"></a>
    <div class="logo"></div>
    <div class="options">
        <button
            class="toggle text-size-{$settings.fontSize}-icon"
            aria-label="Toggle text size"
            onclick={cycleFontSizes}
        ></button>
        <button
            class="toggle {$settings.music
                ? 'music-icon'
                : 'music-crossed-icon'}"
            aria-label="Toggle music"
            onclick={() => {
                $settings.music = !$settings.music;
            }}
        ></button>
    </div>
</div>

<style>
    .bar {
        position: fixed;
        z-index: 169;
        grid-template-columns: auto 1fr 1fr;
        display: grid;
        top: 0;
        left: 0;
        margin: 0 auto;
        width: 100vw;
        height: 4rem;
        background-color: rgba(0, 0, 0, 0.126);
    }
    .options {
        display: flex;
        justify-content: right;
        align-items: center;
    }
    .back {
        background: url("/icons/back.svg") no-repeat 0 50% / auto 100%;
        display: inline-block;
        width: 6rem;
        height: auto;
    }
    .logo {
        background: url("/logo.svg") no-repeat 0 50% / auto 100%;
        display: inline-block;
        width: 10rem;
        height: auto;
        align-items: center;
    }
    .toggle {
        display: inline-block;

        transition: filter 300ms;
        transition: transform 100ms;

        border: none;
        border-radius: 30%;

        background-color: rgba(255, 255, 255, 0.263);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 2.3rem 2.3rem;

        width: 3.2rem;
        height: 3.2rem;
        margin: auto 0.5rem;
    }
    .toggle:hover {
        filter: brightness(0.8);
        cursor: pointer;
    }
    .toggle:active {
        filter: brightness(0.7);
        transform: scale(0.95);
        cursor: pointer;
    }
    .music-icon {
        background-image: url("/icons/music.svg");
    }
    .music-crossed-icon {
        background-image: url("/icons/music-crossed.svg");
    }
    .text-size-small-icon {
        background-image: url("/icons/text-size.svg");
        transform: scale(0.6);
    }
    .text-size-medium-icon {
        background-image: url("/icons/text-size.svg");
        transform: scale(0.8);
    }
    .text-size-large-icon {
        background-image: url("/icons/text-size.svg");
    }
</style>
