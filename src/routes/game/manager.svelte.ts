import { SvelteMap } from 'svelte/reactivity';
import type { Speaker, ProfilePosition, DialogueContext, PromptInfo } from './speaker';
import type { Background } from './background.ts';

// Contains all the data of the game
export class GameManager {
    private events: GameEvent[] = [];
    speakers: Map<string, Speaker> = new SvelteMap();
    currentDialogue: DialogueContext = $state({ text: "", speakerName: "" });
    currentPrompt: PromptInfo | undefined = $state(undefined)
    background: Background = $state({ src: "", frame: "", ambientMusic: "" });
    points = $state(0);
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
        console.log("Executing event", event)
        event.execute(this);
        return false;
    }
    jumpToLabel(label_name: string) {
        const labelIndex = this.events.findIndex(event =>
            event instanceof Label && event.label_name === label_name
        );

        if (labelIndex === -1) {
            throw new Error(`Label "${label_name}" not found.`);
        }

        // Set the currentId to the index of the label, so we continue from there
        this.currentId = labelIndex; // +1 because the label itself should not be executed again
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

export class Label implements GameEvent {
    type = "Label";
    constructor(public label_name: string) { }
    execute(manager: GameManager) {
        // nada
        manager.runNextEvent()
    }
}

export class Jump implements GameEvent {
    type = "Jump";
    constructor(public label_name: string) { }
    execute(manager: GameManager) {
        manager.jumpToLabel(this.label_name)
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

export class Prompt implements GameEvent {
    type = "Prompt";
    constructor(public promptInfo: PromptInfo) { }
    execute(manager: GameManager) {
        manager.currentPrompt = this.promptInfo
    }
}

export class SetBackgroundImage implements GameEvent {
    type = "SetBackgroundImage";
    constructor(public src: string) { }
    execute(manager: GameManager) {
        // These variables are displayed in the text box in-game
        manager.background.src = this.src;
        manager.runNextEvent()
    }
}

export class AwardPoints implements GameEvent {
    type = "AwardPoints";
    constructor(public delta: number) { }
    execute(manager: GameManager) {
        manager.points += this.delta;
    }
}