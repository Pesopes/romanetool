import { SvelteMap } from 'svelte/reactivity';
import type { Speaker, ProfilePosition, DialogueContext } from './speaker';

// Contains all the data of the game
export class GameManager {
    private events: GameEvent[] = [];
    speakers: Map<string, Speaker> = new SvelteMap();
    currentDialogue: DialogueContext = $state({ text: "", speakerName: "" });
    private currentId: number = 0;

    addEvent(event: GameEvent) {
        this.events.push(event);
    }
    // Sets or updates values of the speakers map 
    setSpeaker(codename: string, speaker: Speaker): void {
        this.speakers.set(codename, speaker);
    }
    getSpeaker(codename: string): Speaker {
        const speaker = this.speakers.get(codename);
        if (!speaker) {
            throw new Error(`Speaker with codename "${codename}" not found.`);
        }
        return speaker;
    }
    async runEvents() {
        while (this.currentId < this.events.length) {
            await this.events[this.currentId].execute(this);
            this.currentId++;
        }
    }
    // Executes the next GameEvent in the queue
    runNextEvent() {
        if (this.currentId >= this.events.length) {
            return true;
        }
        const event = this.events[this.currentId++]
        event.execute(this);
        return false;
    }
}

export interface GameEvent {
    type: string;
    execute(manager: GameManager): void;
}

export class ChangeSpeaker implements GameEvent {
    type = "ChangeSpeaker";
    constructor(public codename: string, public position: ProfilePosition) { }
    execute(manager: GameManager) {
        // Reset all others and set their position to none if changing to that position
        manager.speakers.forEach((s, codename) => manager.speakers.set(codename, { ...s, active: false, position: s.position === this.position ? "none" : s.position })
        );
        // Change to the speaker
        const activeSpeaker = manager.getSpeaker(this.codename)
        manager.speakers.set(this.codename, { ...activeSpeaker, active: true, position: this.position })

        // Changing a speaker won't require input
        manager.runNextEvent()
    }
}

export class HideSpeaker implements GameEvent {
    type = "HideSpeaker";
    constructor(public codename: string) { }
    execute(manager: GameManager) {
        // Make inactive and invisible
        manager.speakers.set(this.codename, { ...manager.getSpeaker(this.codename), active: false, position: "none" })
        // Removing a speaker won't require input
        manager.runNextEvent()
    }
}

export class SayLine implements GameEvent {
    type = "SayLine";
    constructor(public codename: string, public line: string) { }
    execute(manager: GameManager) {
        // These variables are displayed in the text box in-game
        manager.currentDialogue.text = this.line;
        manager.currentDialogue.speakerName = manager.getSpeaker(this.codename).name;
    }
}