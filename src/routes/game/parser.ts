import type { ProfilePosition, PromptInfo } from './speaker';
import { ChangeSpeaker, GameManager, HideSpeaker, Jump, Label, Prompt, SayLine, SetBackgroundImage } from './manager.svelte';

export function parseScript(script: string): GameManager {
    // remove # comments
    const withoutComments = script.replace(/(^|\s)(?<!\\)#.*$/gm, '').trim();
    // split into lines
    const lines = withoutComments.split('\n').filter(line => line.trim() !== '');
    // Splits by ; also deleting first character and trimming all whitespace along the way
    const semicolonSplit = (str: string): string[] => str.slice(1).trim().split(";").map((v) => v.trim());

    let manager: GameManager = new GameManager();

    // For choice blocks <<...>>
    let isChoiceBlock = false
    let choiceBuffer: string[] = []; // first is always the question, afterwards are the answers

    // For dialogue blocks [...]
    let codename: string = "";
    let isDialogueBlock = false
    let dialogueBuffer: string[] = [];

    console.log(lines)
    for (const line of lines) {
        // const line = lines[i];
        console.log("Now processing line: ", line)
        if (line.startsWith("[")) {
            isDialogueBlock = true;
            dialogueBuffer = [];

            const headerValues = line.slice(1).trim().split(" ")
            if (headerValues.length < 1)
                throw new Error("Dialogue block speaker argument syntax not valid: not enough arguments")
            if (headerValues.length > 2)
                throw new Error("Dialogue block speaker argument syntax not valid: too many arguments")

            // set new speaker values
            codename = headerValues[0]; // read speaker codename
            const position = headerValues[1] as ProfilePosition;
            const event = new ChangeSpeaker(codename, position);
            manager.addEvent(event);
        } else if (line.startsWith("]")) {
            isDialogueBlock = false; // out of the block
            const dialogueText = dialogueBuffer.join("\n")
            const processedLine = dialogueText.replace(/{(.*?)}/g, (match, code) => `{${manager.getSpeaker(code).image}}`)
            let event = new SayLine(codename, processedLine);
            manager.addEvent(event);
        } else if (line.startsWith("+")) {
            let headerValues = semicolonSplit(line)
            manager.setSpeaker(headerValues[0], {
                name: headerValues[1],
                image: headerValues[2],
                active: false,
                position: 'none'
            })
        } else if (line.startsWith("-")) {
            let headerValues = semicolonSplit(line)
            const removingCodename = headerValues[0]
            manager.addEvent(new HideSpeaker(removingCodename))
        } else if (line.startsWith("@")) {
            let name = line.slice(1).trim()
            manager.addEvent(new Label(name))
        } else if (line.startsWith("=>")) {
            let name = line.slice(2).trim().slice(1)
            manager.addEvent(new Jump(name))
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
        } else if (line.startsWith("<<")) { //START of choice block
            isChoiceBlock = true;
            choiceBuffer = [];
        } else if (line.startsWith(">>")) { //END of choice block
            if (choiceBuffer.length < 1) {
                throw new Error("Choice block syntax not valid: not enough arguments")
            }
            isChoiceBlock = false;
            manager.addEvent(new Prompt(parseChoiceBuffer(choiceBuffer)));
        } else if (isDialogueBlock) { //IN dialogue block
            dialogueBuffer.push(line);
        } else if (isChoiceBlock) { //IN choice block
            choiceBuffer.push(line.trim());
        }
    }


    console.log("Parsing complete: ", manager)
    return manager
}

function parseChoiceBuffer(choiceBuffer: string[]): PromptInfo {
    // Syntax example
    /*<<
Could you please...  
* shut up?! => @RIMMER_LEAVE
* stop yapping? => @RIMMER_ANGRY
* tell me something about the Space Corps Directive 102930? => @RIMMER_HAPPY
>> */
    const question = choiceBuffer[0]

    const choices = choiceBuffer.slice(1).map((line) => {
        const headerValues = line.split("=>")
        if (headerValues.length > 2)
            throw new Error("Too many arguments in choice block answer" + headerValues,)
        const answer = headerValues[0].slice(1).trim() // remove the * symbol
        const label = headerValues[1].trim().slice(1) // remove the @ symbol
        return { answer: answer, event: new Jump(label) }
    })
    return { choices: choices, question: question }
}
