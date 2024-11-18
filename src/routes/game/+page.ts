import type { PageLoad } from './$types';
import type { Speaker } from './speaker';
import { ChangeSpeaker, EventManager, type GameEvent,SayLine } from './events';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('script.txt');
	const text = await res.text();

	// remove # comments
	const withoutComments = text.replace(/(^|\s)(?<!\\)#.*$/gm, '').trim();
	// split into lines
	const lines = withoutComments.split('\n').filter(line => line.trim() !== '');

	return {
		script: {
			manager: parseLines(lines)
		}
	};
};

function parseLines(lines: string[]): EventManager {
	let manager: EventManager = new EventManager();

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
				let event = new SayLine({...availableSpeakers[availableCodenames.indexOf(codename)]}, text);
				manager.addEvent(event);
			}
			// set new speaker values
			let headerValues = line.slice(1, -1).split(" ")
			codename = headerValues[0]; // read speaker codename
			position = headerValues[1] as 'left' | 'right';
			let event = new ChangeSpeaker({...availableSpeakers[availableCodenames.indexOf(codename)]},position)
			manager.addEvent(event);
			//
			text = "";
			continue
		}
		text += line + "\n"
	}
	if (codename) {
		let event = new SayLine({...availableSpeakers[availableCodenames.indexOf(codename)]}, text);
		manager.addEvent(event);
	}
	return manager
}