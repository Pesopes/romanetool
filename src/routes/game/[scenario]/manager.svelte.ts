import { SvelteMap } from 'svelte/reactivity';
import type { Speaker, ProfilePosition, DialogueContext, PromptInfo } from './speaker';
import type { Background, Overlay } from './background.ts';
import { settings } from '$lib/settings';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { tweened } from 'svelte/motion';
import { cubicOut, linear } from 'svelte/easing';
// Contains all the data of the game
export class GameManager {
    private events: GameEvent[] = [];
    speakers: Map<string, Speaker> = new SvelteMap();
    variables: Map<string, any> = new SvelteMap();
    currentDialogue: DialogueContext = $state({ text: "", speakerName: "" });
    currentPrompt: PromptInfo | undefined = $state(undefined)
    background: Background = $state({ src: "", frame: "", ambientMusic: "", shaderCode: "" });
    overlay: Overlay = $state({ src: "", title: "", subtitle: "", opacity: tweened(0, { duration: 500, easing: linear }) })
    points = $state(0);
    private currentId: number = 0;
    private blockEvents = $state({ prompt: false, speaking: false, timed: false });
    isBlocked = $derived(this.blockEvents.prompt || this.blockEvents.speaking || this.blockEvents.timed)

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
        if (this.isBlocked)
            return false;
        const event = this.events[this.currentId++]
        // console.log("Executing event", event)
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
        this.currentId = labelIndex;
    }

    // Blocks events for the given amount of miliseconds
    timedBlockFor(ms: number) {
        this.blockEvents.timed = true
        setTimeout(() => this.blockEvents.timed = false, ms)
    }
    removeTimedBlock() {
        this.blockEvents.timed = false
    }
    startPrompt() {
        this.blockEvents.prompt = true
    }
    startSpeaking() {
        this.blockEvents.speaking = true
    }
    stopSpeaking() {
        this.blockEvents.speaking = false
    }
    choosePrompt(i: number) {
        this.blockEvents.prompt = false
        this.currentPrompt?.choices[i].event.execute(this)
        this.currentPrompt = undefined
    }
}

export interface GameEvent {
    type: string;
    execute(manager: GameManager): void;
}

// Usually runs at the END
export class FadeInScreen implements GameEvent {
    type = "ShowScreen";
    constructor(public title: string, public subtitle: string, public fadeDuration: number) { }
    execute(manager: GameManager) {

        manager.overlay.title = this.title;
        manager.overlay.subtitle = this.subtitle;
        manager.overlay.opacity.set(1.0, { duration: this.fadeDuration })
        // So the player doesn't play while the fade is happening
        manager.timedBlockFor(this.fadeDuration);
    }
}
// Usually runs at the START
export class FadeOutScreen implements GameEvent {
    type = "ShowScreen";
    constructor(public title: string, public subtitle: string, public fadeDuration: number) { }
    async execute(manager: GameManager) {
        manager.runNextEvent()

        manager.overlay.title = this.title;
        manager.overlay.subtitle = this.subtitle;
        manager.overlay.opacity.set(1.0, { duration: 0 })
        manager.overlay.opacity.set(0, { duration: this.fadeDuration })
        // So the player doesn't play while the fade is happening
        manager.timedBlockFor(this.fadeDuration);
    }
}

export class MoveSpeaker implements GameEvent {
    type = "MoveSpeaker";
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

export class AddSpeaker implements GameEvent {
    type = "AddSpeaker";
    constructor(public codename: string, public speaker: Speaker) { }
    execute(manager: GameManager) {
        // Make inactive and invisible
        manager.setSpeaker(this.codename, this.speaker);
        // Removing a speaker won't require input
        manager.runNextEvent()
    }
}

export class SayLine implements GameEvent {
    type = "SayLine";
    constructor(public codename: string, public line: string) { }
    execute(manager: GameManager) {
        // These variables are displayed in the text box in-game
        manager.currentDialogue.text = this.line.replace(/{(.*?)}/g, (match, code) => `{${manager.getSpeaker(code).image}}`);
        manager.currentDialogue.speakerName = manager.getSpeaker(this.codename).name;
        manager.startSpeaking()
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
    constructor(public label_name: string, public conditionName: string) { }
    execute(manager: GameManager) {
        const value = manager.variables.get(this.conditionName)
        if (value === undefined || value === 1) {
            manager.jumpToLabel(this.label_name)
        }
        manager.runNextEvent()
    }
}

export class Prompt implements GameEvent {
    type = "Prompt";
    constructor(public promptInfo: PromptInfo) { }
    execute(manager: GameManager) {
        manager.currentPrompt = this.promptInfo
        const speaker = manager.getSpeaker(this.promptInfo.speaker)
        manager.currentDialogue = { speakerName: speaker.name, text: this.promptInfo.question }
        manager.startPrompt()
    }
}

export class SetBackgroundImage implements GameEvent {
    type = "SetBackgroundImage";
    constructor(public src: string) { }
    execute(manager: GameManager) {
        manager.background.src = this.src;
        manager.runNextEvent()
    }
}

export class SetBackgroundShader implements GameEvent {
    type = "SetBackgroundShader";
    constructor(public shaderPath: string) { }
    async execute(manager: GameManager) {
        const code = await fetch(this.shaderPath)
        manager.background.shaderCode = await code.text()
        manager.runNextEvent()
    }
}

export class SetBackgroundAmbientMusic implements GameEvent {
    type = "SetBackgroundAmbientMusic";
    constructor(public musicPath: string) { }
    async execute(manager: GameManager) {
        manager.background.ambientMusic = this.musicPath;
        manager.runNextEvent()
    }
}
export class PlaySound implements GameEvent {
    type = "PlaySound";
    constructor(public soundPath: string) { }
    async execute(manager: GameManager) {
        if (get(settings).sounds) {
            const sound = new Audio(this.soundPath);
            sound.play()
        }
        manager.runNextEvent()
    }
}

export class AwardPoints implements GameEvent {
    type = "AwardPoints";
    constructor(public delta: number) { }
    execute(manager: GameManager) {
        manager.points += this.delta;
        manager.runNextEvent()
    }
}

export class SetVariable implements GameEvent {
    type = "SetVariable";
    constructor(public name: string, public value: any) { }
    execute(manager: GameManager) {
        /* if (this.value.type() === String) {

        } */
        manager.variables.set(this.name, this.value);
        manager.runNextEvent()
    }
}

export class ChangeScript implements GameEvent {
    type = "ChangeScript";
    constructor(public scenarioId: string, public scriptName?: string) { }
    // Default to metadata.json if no scriptName provided
    execute(manager: GameManager) {
        let path;
        if (this.scriptName != null) {
            path = `${this.scenarioId}?script=${this.scriptName}`
        } else {
            path = `${this.scenarioId}`
        }
        goto(path, { replaceState: true })
    }
}

export type Operations = "+" | "-" | "*" | "/" | ">" | "<" | "<=" | ">=" | "="

export class Operation implements GameEvent {
    type = "$";
    constructor(public name: string, public operation: Operations, public value: any, public out: string) { }
    execute(manager: GameManager) {
        let oldValue = manager.variables.get(this.name);

        if (typeof this.value === "string") {
            let tmp = manager.variables.get(this.value);
            if (tmp) {
                this.value = tmp;
            }
            else {
                new Error("Accessing variable " + this.value + " which doesn't exist")
            }
        }
        if (typeof this.out === "undefined") {
            this.out = this.name;// Perform the operation on this value if the out value is not specified
        }
        if (typeof oldValue !== "undefined") {
            switch (this.operation) {
                case "+":
                    manager.variables.set(this.out, oldValue + this.value);
                    break;
                case "-":
                    manager.variables.set(this.out, oldValue - this.value);
                    break;
                case "*":
                    manager.variables.set(this.out, oldValue * this.value);
                    break;
                case "/":
                    manager.variables.set(this.out, oldValue / this.value);
                    break;
                case ">":
                    manager.variables.set(this.out, oldValue > this.value ? 1 : 0);
                    break;
                case "<":
                    manager.variables.set(this.out, oldValue < this.value ? 1 : 0);
                    break;
                case ">=":
                    manager.variables.set(this.out, oldValue >= this.value ? 1 : 0);
                    break;
                case "<=":
                    manager.variables.set(this.out, oldValue <= this.value ? 1 : 0);
                    break;
                case "=":
                    manager.variables.set(this.out, oldValue === this.value ? 1 : 0);
                    break;
                default:
                    throw Error("Unknown operation");
            }
        } else {
            throw Error("Accessing variable " + this.name + " which doesn't exist");
        }
        // console.log(this.out, " is ", manager.variables.get(this.out))
        manager.runNextEvent();
    }
}