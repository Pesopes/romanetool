import type { PageLoad } from './$types';


type Dialogue = {
	speakerName: string;
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

	let speaker = "";
	let position: 'left' | 'right' = "left";
	let text = ""
	let insideBlock = false;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.startsWith("[")) {
			if (speaker) {
				dialogues.push({ speakerName: speaker, position: position, text: text })
			}
			let words = line.slice(1, -1).split(" ")
			speaker = words[0];
			position = words[1] as 'left' | 'right';
			text = "";
			insideBlock = true
			continue
		}
		if (line.startsWith("[") && insideBlock) {
			insideBlock = false
		}
		if (insideBlock) {
			text += line + "\n"
		}
	}
	if (speaker) {
		dialogues.push({ speakerName: speaker, position: position, text: text })
	}
	return dialogues
}