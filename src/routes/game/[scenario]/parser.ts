import type { ProfilePosition, PromptInfo } from './speaker';
import { AddSpeaker, MoveSpeaker, GameManager, HideSpeaker, Jump, Label, Operation, Prompt, SayLine, SetBackgroundAmbientMusic, SetBackgroundImage, SetBackgroundShader, SetVariable, type Operations, PlaySound, ChangeScript, FadeInScreen, FadeOutScreen, AutoContinueAfter, } from './manager.svelte';

export function parseScript(script: string, scriptName: string): GameManager {
    const convertPath = (path: string) => {
        if (path.startsWith("./")) {
            return `/scenarios/${scriptName}/${path.slice(2)}`
        }
        return path
    }
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

    for (const line of lines) {
        // Dialogue
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
            const event = new MoveSpeaker(codename, position);
            manager.addEvent(event);
        } else if (line.startsWith("]")) {
            isDialogueBlock = false; // out of the block
            const dialogueText = dialogueBuffer.join("\n")
            /* const processedLine = dialogueText.replace(/{(.*?)}/g, (match, code) => `{${manager.getSpeaker(code).image}}`) */
            let event = new SayLine(codename, dialogueText);
            manager.addEvent(event);
        } else if (line.startsWith("+")) {
            let headerValues = semicolonSplit(line)
            manager.addEvent(new AddSpeaker(headerValues[0], {
                name: headerValues[1],
                image: convertPath(headerValues[2]),
                active: false,
                position: 'none'
            }))
        } else if (line.startsWith("-")) {
            let headerValues = semicolonSplit(line)
            const removingCodename = headerValues[0]
            manager.addEvent(new HideSpeaker(removingCodename))
        } else if (line.startsWith("@")) {
            let name = line.slice(1).trim()
            manager.addEvent(new Label(name))
        } else if (line.startsWith("=>")) {
            let header = line.slice(2).trim()

            if (header.startsWith("(")) {
                // Conditional jumps
                let headerValues = header.slice(1).split(")")
                let name = headerValues[1].trim().slice(1)
                let op = parseOperation(headerValues[0].trim())
                if (op) {
                    manager.addEvent(new Operation(op.left, op.operation, op.right, manager.mostRecentAnswerName))
                } else {
                    manager.addEvent(new Operation(headerValues[0].trim(), "==" as Operations, "1", manager.mostRecentAnswerName))
                }
                manager.addEvent(new Jump(name, manager.mostRecentAnswerName))
            } else {
                // Unconditional jump
                let name = line.slice(2).trim().slice(1)
                manager.addEvent(new Jump(name, ""))
            }
        } else if (line.startsWith("$")) {
            let headerValues = line.slice(1).trim().split(";")
            switch (headerValues[0]) {
                case "SetBackgroundImage":
                    manager.addEvent(new SetBackgroundImage(convertPath(headerValues[1])));
                    break;
                case "SetBackgroundShader":
                    manager.addEvent(new SetBackgroundShader(convertPath(headerValues[1])));
                    break;
                case "SetVariable":
                    manager.addEvent(new SetVariable(String(headerValues[1]), Number(headerValues[2])));
                    break;
                case "$":
                    manager.addEvent(new Operation(headerValues[1], headerValues[2] as Operations, headerValues[3], headerValues[4]));
                    break;
                case "SetBackgroundAmbientMusic":
                    manager.addEvent(new SetBackgroundAmbientMusic(convertPath(headerValues[1])));
                    break;
                case "PlaySound":
                    manager.addEvent(new PlaySound(convertPath(headerValues[1])));
                    break;
                case "AutoContinueAfter":
                    const fontSpeed = Number(headerValues[1]) || undefined
                    manager.addEvent(new AutoContinueAfter(fontSpeed));
                    break;
                case "FadeInScreen":
                    // The fadeDuration is optional
                    if (headerValues.length <= 3) {
                        manager.addEvent(new FadeInScreen(headerValues[1], headerValues[2], 5000));
                    } else {
                        manager.addEvent(new FadeInScreen(headerValues[1], headerValues[2], Number(headerValues[3])));
                    }
                    break;
                case "FadeOutScreen":
                    // The fadeDuration is optional
                    if (headerValues.length <= 3) {
                        // Hard code 5s duration
                        manager.addEvent(new FadeOutScreen(headerValues[1], headerValues[2], 5000));
                    } else {
                        manager.addEvent(new FadeOutScreen(headerValues[1], headerValues[2], Number(headerValues[3])));
                    }
                    break;
                case "ChangeScript":
                    manager.addEvent(new ChangeScript(scriptName, headerValues[1]));
                    break;
                case "ChangeScenario":
                    if (headerValues.length <= 2) {
                        manager.addEvent(new ChangeScript(headerValues[1], undefined));
                    } else {
                        manager.addEvent(new ChangeScript(headerValues[1], headerValues[2]));
                    }
                    break;
                default:
                    throw new Error(`Command "$${headerValues[0]}" not recognized.`)
            }
        } else if (line.startsWith("<<")) { //START of choice block
            isChoiceBlock = true;
            choiceBuffer = [];
            const headerValues = line.slice(2).trim().split(" ")
            if (headerValues.length < 1)
                throw new Error("Choice block speaker argument syntax not valid: not enough arguments")
            if (headerValues.length > 2)
                throw new Error("Choice block speaker argument syntax not valid: too many arguments")

            // set new speaker values
            codename = headerValues[0]; // read speaker codename
            const position = headerValues[1] as ProfilePosition;
            const event = new MoveSpeaker(codename, position);
            manager.addEvent(event);
        } else if (line.startsWith(">>")) { //END of choice block
            if (choiceBuffer.length < 1) {
                throw new Error("Choice block syntax not valid: not enough arguments")
            }
            isChoiceBlock = false;
            manager.addEvent(new Prompt(parseChoiceBuffer(choiceBuffer, codename)));
        } else if (isDialogueBlock) { //IN dialogue block
            dialogueBuffer.push(line);
        } else if (isChoiceBlock) { //IN choice block
            choiceBuffer.push(line.trim());
        }
    }
    // console.log("Finished parsing:", manager)
    return manager
}

function parseChoiceBuffer(choiceBuffer: string[], codename: string): PromptInfo {
    // Syntax example
    /*<< RIMMER right
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
        return { answer: answer, event: new Jump(label, "") }
    })
    return { speaker: codename, choices: choices, question: question }
}

export function parseOperation(input: string): { operation: Operations, left: string, right: string } | null {
    const regex = /([a-zA-Z_][a-zA-Z0-9_]*|-?\d+\.?\d*)\s*(\+|-|\*|\/|>|<|<=|>=|=)\s*([a-zA-Z_][a-zA-Z0-9_]*|-?\d+\.?\d*)/;
    const match = input.match(regex);

    if (!match) return null;

    const [, left, operation, right] = match;
    if (isOperation(operation)) {
        return {
            operation: operation as Operations,
            left: left.trim(),
            right: right.trim()
        };
    }
    return null;
}

function isOperation(op: string): op is Operations {
    return ["+", "-", "*", "/", ">", "<", "<=", ">=", "=", "=="].includes(op);
}