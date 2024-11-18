
export interface DialogueContext {
	speakerName: string
	dialogue: string
}

export interface Speaker {
	name: string
	image: string
}

export interface SpeakerProfile {
	speaker: Speaker
	active: boolean
}