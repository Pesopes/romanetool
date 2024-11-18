import type { Speaker, SpeakerProfile, DialogueContext } from './speaker';

export class EventManager {
    private events: GameEvent[] = [];
    private currentId: number = 0;

    addEvent(event: GameEvent) {
        this.events.push(event);
    }

    async runEvents(profilePositions: string[], speakerProfiles: SpeakerProfile[], dialogueContext: DialogueContext) {
        while (this.currentId < this.events.length) {
            await this.events[this.currentId].execute(profilePositions, speakerProfiles, dialogueContext);
            this.currentId++;
        }
    }

    runNextEvent(profilePositions: string[], speakerProfiles: SpeakerProfile[], dialogueContext: DialogueContext) {
        if (this.currentId >= this.events.length) {
            return true;
        }
        this.events[this.currentId].execute(profilePositions, speakerProfiles, dialogueContext);
        this.currentId++;
        return false;
    }
}

export interface GameEvent {
    type: string;
    execute(profilePositions: string[], speakerProfiles: SpeakerProfile[], dialogueContext: DialogueContext): void;
}

export class ChangeSpeaker implements GameEvent {
    type = "ChangeSpeaker";
    constructor(public speaker: Speaker, public position: string) { }
    execute(profilePositions: string[], speakerProfiles: SpeakerProfile[], dialogueContext: DialogueContext) {
        for (var p of speakerProfiles) {
            p.active = false;
        }
        let id = profilePositions.indexOf(
            this.position,
        );
        speakerProfiles[id] = {
            speaker: this.speaker,
            active: true,
        };
    }
}

export class SayLine implements GameEvent {
    type = "SayLine";
    constructor(public speaker: Speaker, public line: string) { }
    execute(profilePositions: string[], speakerProfiles: SpeakerProfile[], dialogueContext: DialogueContext) {
        dialogueContext.dialogue = this.line;
        dialogueContext.speakerName = this.speaker.name;
    }
}