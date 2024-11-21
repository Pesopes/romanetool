import type { ProfilePosition } from './speaker';
import { ChangeSpeaker, GameManager, HideSpeaker, SayLine, SetBackgroundImage } from './manager.svelte';

export function parseScript(script: string): GameManager {
    // remove # comments
    const withoutComments = script.replace(/(^|\s)(?<!\\)#.*$/gm, '').trim();
    // split into lines
    const lines = withoutComments.split('\n').filter(line => line.trim() !== '');
    // Splits by ; also deleting first character and trimming all whitespace along the way
    const semicolonSplit = (str: string): string[] => str.slice(1).trim().split(";").map((v) => v.trim());

    let manager: GameManager = new GameManager();

    let codename: string = "";
    let position: ProfilePosition = "none";
    let text = ""
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("+")) {
            let headerValues = semicolonSplit(line)
            manager.setSpeaker(headerValues[0], {
                name: headerValues[1],
                image: headerValues[2],
                active: false,
                position: 'none'
            })
        } else if (line.startsWith("-")) {
            let headerValues = semicolonSplit(line)
            const codename = headerValues[0]
            manager.addEvent(new HideSpeaker(codename))
        } else if (line.startsWith("[")) {
            // save previous speaker data to dialogues
            if (codename != "") {
                let event = new SayLine(codename, text);
                manager.addEvent(event);
            }
            // Parse "[codename position]" syntax
            let headerValues = line.slice(1, -1).split(" ")
            // set new speaker values
            codename = headerValues[0]; // read speaker codename
            position = headerValues[1] as ProfilePosition;
            let event = new ChangeSpeaker(codename, position);
            manager.addEvent(event);
            //
            text = "";
            continue
        } else if (line.startsWith("$")) {
            let headerValues = line.slice(1).trim().split(";")
            switch (headerValues[0]) {
                case "SetBackgroundImage":
                    let event = new SetBackgroundImage(headerValues[1]);
                    manager.addEvent(event);
                    break;

                default:
                    break;
            }
        } else {
            // Replace {CODENAME} with {imgsrc}
            const modified = line.replace(/{(.*?)}/g, (match, code) => `{${manager.getSpeaker(code).image}}`)
            text += modified + "\n"
        }
    }
    if (codename) {
        let event = new SayLine(codename, text);
        manager.addEvent(event);
    }
    return manager
}