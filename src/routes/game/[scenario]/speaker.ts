import type { GameEvent } from "./manager.svelte"

export type ProfilePosition = 'none' | 'left' | 'right'

export interface Choice {
	answer: string,
	event: GameEvent
}

export interface PromptInfo {
	speaker: string
	question: string,
	choices: Choice[]
}

export interface DialogueContext {
	speakerName: string
	text: string
	overrideTextSpeed: number | null // null means to not override the text speed
}

export interface Speaker {
	name: string
	image: string
	active: boolean
	position: ProfilePosition
}