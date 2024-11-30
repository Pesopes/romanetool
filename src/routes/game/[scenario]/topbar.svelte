<!-- @component A nav bar with some settings, a logo and the back button. -->
<script lang="ts">
    import { settings } from "$lib/settings";

    // Dumb but works
    // Goes like this: small -> medium -> large -> small
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
    // Also dumb but works
    // Goes like this: slow -> medium -> fast -> slow
    function cycleTextSpeeds() {
        let size = $settings.textSpeed;
        if (size === "slow") {
            $settings.textSpeed = "medium";
        } else if (size === "medium") {
            $settings.textSpeed = "fast";
        } else if (size === "fast") {
            $settings.textSpeed = "slow";
        }
    }
</script>

<div class="bar" style="--background-color: #ebc3db29">
    <a href="/game" class="back" aria-label="Go back"></a>
    <div class="logo"></div>
    <div class="options">
        <button
            class="toggle text-speed-{$settings.textSpeed}-icon"
            aria-label="Change text speed"
            onclick={cycleTextSpeeds}
        ></button>
        <button
            class="toggle text-size-{$settings.fontSize}-icon"
            aria-label="Change text size"
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
        <button
            class="toggle {$settings.sounds
                ? 'sound-icon'
                : 'sound-crossed-icon'}"
            aria-label="Toggle sound effects"
            onclick={() => {
                $settings.sounds = !$settings.sounds;
            }}
        ></button>
    </div>
</div>

<style>
    .bar {
        position: fixed;
        z-index: 169;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        height: 3.2rem;

        background-color: var(--background-color);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 3.3rem 3.3rem;
        clip-path: polygon(0 0, 75% 0, 100% 100%, 25% 100%);
        margin: auto 1rem;
    }
    .logo {
        background: url("/logo_alt.svg") no-repeat center center / contain;
        /* background-color: var(--background-color); */
        width: 15rem;
        height: 3.2rem; /* Adjust height to match bar */
        display: flex; /* Ensures proper centering */
        margin: 0 auto; /* Centers the logo horizontally */
    }
    .toggle {
        display: inline-block;

        transition: filter 300ms;
        transition: transform 100ms;

        border: none;
        /* border-radius: 30%; */

        background-color: var(--background-color);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 2.3rem 2.3rem;
        clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);

        width: 4.2rem;
        height: 3.2rem;
        margin: auto -0.3rem;
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

    /* The icons for the toggles are seperate classes */

    .music-icon {
        background-image: url("/icons/music.svg");
    }
    .music-crossed-icon {
        background-image: url("/icons/music-crossed.svg");
    }
    .sound-icon {
        background-image: url("/icons/sound.svg");
    }
    .sound-crossed-icon {
        background-image: url("/icons/sound-crossed.svg");
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
    .text-speed-slow-icon {
        background-image: url("/icons/speedometer-slow.svg");
    }
    .text-speed-medium-icon {
        background-image: url("/icons/speedometer-medium.svg");
    }
    .text-speed-fast-icon {
        background-image: url("/icons/speedometer-fast.svg");
    }
</style>
