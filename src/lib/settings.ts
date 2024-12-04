import { writable } from "svelte/store";
import { browser } from "$app/environment"

export interface Settings {
    fontSize: 'small' | 'medium' | 'large';
    music: boolean;
    sounds: boolean;
    textSpeed: 'slow' | 'medium' | 'fast';
}

// Settings
const defaultSettings: Settings = {
    fontSize: 'medium',
    music: true,
    sounds: true,
    textSpeed: 'medium',
}
// Loads from localStorage, if not there it returns the default values
function loadSettings(): Settings {
    // only run if client side
    const saved = browser && localStorage.getItem("settings");
    try {
        return saved ? (JSON.parse(saved) as Settings) : defaultSettings;
    } catch {
        console.warn("Failed to parse settings from localStorage, falling back to defaults.");
        return defaultSettings;
    }
}
const storedSettings = loadSettings()

export const settings = writable(storedSettings);
settings.subscribe(value => {
    // only run if client side
    if (browser) localStorage.setItem("settings", JSON.stringify(value));
});

export const convertFontSizeSetting = (fontSize: 'small' | 'medium' | 'large') => {
    switch (fontSize) {
        case "small":
            return "1rem";
        case "medium":
            return "2rem";
        case "large":
            return "3rem";
    }
}

export const convertTextSpeedSetting = (textSpeed: 'slow' | 'medium' | 'fast') => {
    // Parse settings strings into actual numbers
    // Bigger number means slower because it modifies the animation _delay_ not the speed
    switch (textSpeed) {
        case "slow":
            return 1.5;
        case "medium":
            return 1;
        case "fast":
            return 0.5;
    }
}