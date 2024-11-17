import type { PageLoad } from './$types';

interface Speaker {
	name: string
	image: string
}

export interface SpeakerProfile {
	speaker: Speaker
	active: boolean
}

interface Dialogue {
	speaker: Speaker;
	text: string;
	position: 'left' | 'right';
}

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('script.txt');
	const text = await res.text();

	// remove # comments
	const withoutComments = text.replace(/(^|\s)(?<!\\)#.*$/gm, '').trim();
	// split into lines
	const lines = withoutComments.split('\n').filter(line => line.trim() !== '');

	return {
		script: {
			dialogues: parseLines(lines)
		}
	};
};

function parseLines(lines: string[]): Dialogue[] {
	let dialogues: Dialogue[] = [];

	let availableSpeakers: Speaker[] = []
	let availableCodenames: string[] = []


	let codename: string = "";
	let position: 'left' | 'right' = "left";
	let text = ""
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.startsWith("-")) {
			let headerValues = line.split(" ")
			availableCodenames.push(headerValues[1])
			availableSpeakers.push({
				name: headerValues[2],
				image: headerValues[3],
			})
		}

		if (line.startsWith("[")) {
			// save previous speaker data to dialogues
			if (codename != "") {
				dialogues.push({ speaker: { ...availableSpeakers[availableCodenames.indexOf(codename)] }, position: position, text: text })
			}
			// set new speaker values
			let headerValues = line.slice(1, -1).split(" ")
			codename = headerValues[0]; // read speaker codename
			position = headerValues[1] as 'left' | 'right';
			//
			text = "";
			continue
		}
		text += line + "\n"
	}
	if (codename) {
		dialogues.push({ speaker: { ...availableSpeakers[availableCodenames.indexOf(codename)] }, position: position, text: text })
	}
	return dialogues
}