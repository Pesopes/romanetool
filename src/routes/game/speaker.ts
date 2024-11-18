export type ProfilePosition = 'none' | 'left' | 'right'

export interface DialogueContext {
	speakerName: string
	text: string
}

export interface Speaker {
	name: string
	image: string
	active: boolean
	position: ProfilePosition
}