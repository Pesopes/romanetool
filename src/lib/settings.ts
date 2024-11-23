import { writable } from "svelte/store";
import { browser } from "$app/environment"

export interface Settings {
    fontSize: 'small' | 'medium' | 'large';
    music: boolean;
    fastText: boolean;
}

// Settings
const defaultSettings: Settings = {
    fontSize: 'medium',
    music: true,
    fastText: false,
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