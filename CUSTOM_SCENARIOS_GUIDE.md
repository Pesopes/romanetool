# How to make your scenario

## Get the project

First, clone this project locally using Git:

```bash
git clone https://github.com/Pesopes/romanetool
```

### Install dependencies

Then, inside the directory run:

```bash
npm install
```

### Run

To see the site, run this

```bash
npm run dev
```

### Build:

```bash
npm run build
```

## Add custom scenarios

Inside the _/static/scenarios_ directory make a new directory and name it. The name you will choose will only be used in the url and will _not_ be the visible name of the scenario.

Each scenario folder has to have a metadata.json, be sure to place it in the **root** of the folder. The best way to start is probably to copy the examplescenario folder and rename it.

These are the options you have to include

- "name" – This will be visible only in the scenario picker.
- "description" – Describes the scenario to easily distinguish it from others. Visible only in the scenario picker.
- "entrypoint" – The script file that will be run upon choosing this scenario
- "icon" – A small image that is visible only in the scenario picker. **Leave blank to not show any picture**
- "author" – Just a small acknowledgment for your hard work. Visible only in the scenario picker.
- "year" –  Visible only in the scenario picker.
- "hidden" – if true it will not be visible in the scneario picker. Useful if it is under development and not ready for others to view but it is still accessible by using a direct link.
  
  > The "icon" and "entrypoint" options both pick from the root of your scenario folder

This is how a _metadata.json_ file should look:

```JSON
{
    "name": "This is the name of the scenario",
    "description": "A short description that doesn't spoil the story too much",
    "entrypoint": "main.nls",
    "icon": "nice_image.png",
    "author": "YOU!",
    "year": 3030,
    "hiddden": false
}
```
> You can hide the examplescenario by setting its "hidden" metadata to true

# Script syntax

## Basic info

The script executes commands line by line from the top of the file. The file extension is _.nls_ standing for _novel lang script_ ( probably but I don't remember).

A lot of the syntax splits parts of the command by a semicolon (";") and _strips_ it afterwards, this means that you don't have to worry too much about whitespace.

> While programming keep the dev tools in your browser open (F12). Any errors in the script will appear there. 

## Comments

Anything after the "#" symbol is ignored and is considered a comment (like in Python for example)

```
# I can write anything here because it is just a comment
```

## Paths

Whenever you have to define a path there are two different places the asset can be found.

If it is **locally** defined, meaning that it is inside the scenario directory: **prepend the path with "./"** and then write the path according to the _root of your custom scenario folder_.

```
+ SHERLOCK;Sherlock;./sherlock.png 
```

If it is **globally** defined, meaning that it is somewhere inside the Romanetool project static directory: **prepend the path with "/"** according to the _root of the static directory_ in your project.

```
$PlaySound;/sounds/intro.ogg
```

## Adding characters

To make a character say something you have to first _define_ it.

Syntax:

```
+ CODENAME; name; image_path
```

- CODENAME – This is the characters _id_ ensure that it is unique and preferrably one word only (you can use symbols like "_"). You will then use this to define who is saying something.
- name – This is the _display name_ of the character visible in game.
- image_path – See Paths

## Hide character

This will make the character disappear from the screen. It will **not** delete the character.

Syntax:

```
- CODENAME
```

- CODENAME – See Adding characters

## Dialogue

Once you have a character defined you probably want it to say something. Be sure to follow the newlines exactly like shown below.

Syntax:

```
[CODENAME position
multiline text
another line
]
```

- CODENAME – See Adding characters
- position – Either "left" or "right". Where the profile picture will show up (to hold a natural conversation switch between left and right making it easy to follow who is who).
  
  > be sure the ending "]" is on a new line

## Labels

These do not do anything on their own and are used in conjunction with jumps. Labels mark points in the script for jumps or prompts to refer back to.

Syntax:

```
@LABEL_NAME
```

> The label name doesn't actually have to be in all caps despite it being like this in most examples

## Jumps

Used symbols:

- var, var_1, var_2 – the names of the variables to check or just numbers

- LABEL_NAME – label to jump to See Labels

Performs the operation before the jump and the result is used as a condition for it (saved in "ans" variable):

```
=> (var_1 operation var_2) @LABEL_NAME
```
If the result is 1 this will **jump** to the place in the script denoted by the *LABEL_NAME*.
If there is only one variable, it is taken as the condition for the jump

```
=> (var) @LABEL_NAME
```

You can also omit the "(var)" to **always** jump:
```
=> @LABEL_NAME
```

Example:
```
=> (points >= 1600) @HIGHEST_SAT_SCORE_ENDING
```

## Prompts

The `<< >>` syntax is used to create interactive dialogue prompts with multiple choices. It allows the story to have different outcomes.


**Syntax:**
```
<< CHARACTER POSITION
Dialog text or question...  
* Option 1 => @LABEL_1
* Option 2 => @LABEL_2
* Option 3 => @LABEL_3
>>
```


**Components:**
- CHARACTER – Specifies which character is speaking
- POSITION – Specifies the position of the speaker on the screen ( "left" or "right").
- text – This will be presented above the choices. You can either make this a question or leave the sentence incomplete and let the player complete it by making a choice.

- Options
   - A list of choices the player can select.
   - Each option starts with `*` followed by the choice text and a corresponding label to direct the story.
   - Example: `* stop yapping? => @RIMMER_ANGRY`
- Labels – See Labels


**Behaviour:**
- Once a player selects an option, the script jumps to the corresponding label.
- Choices allow branching storylines or different outcomes.
	- If you want to assign points for the different answers just put those operations after the label which the prompt jumps to (You can see something like this in _examplescenario_)

**Example:**
```
<< JARJAR right
What is the best place to start watching the Star Wars saga?
* The prequel trilogy => @BAD_ENDING
* The original trilogy => @GOOD_ENDING
* The sequel trilogy => @VERY_BAD_ENDING
>>
```

---

## Inline text styling

Text inside dialogue or prompts can include some extra styling.

- %wavy text%
- \*impact text\*
- \n creates a newline, without a page break
- {CODENAME} will display the corresponding profile image there

Punctuation ("." "," "?" "!") will create pauses in the text. (The comma is a shorter pause than others)
This behaviour can be prevented by _escaping_ the symbol \. (e.g., "Mr. Holmes" has a pause, "Mr\. Holmes" does not)

> You can't escape "?" or "!" because I'm lazy and don't think it is needed.

> A lot of this syntax was "appropriated" from the text system in [Celeste](https://www.celestegame.com/) (Go play it!)

## Commands
There are a lot of commands to manipulate the game. They are always denoted with a "$" the command name and anything after that are the parameters passed into the command. Each command has different parameters.

### SetBackgroundImage
Changes the image of the background of the whole game.
Syntax:
```
$SetBackgroundImage; path_to_image
```

> See Paths

---

### SetBackgroundShader
Displays a shader in front of the background. Uses [svader](https://github.com/sockmaster27/svader) and WebGL with [GLSL](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders) under the hood. Look for files ending with _.frag_ in the examplescenario folder for inspiration.

Syntax:
```
$SetBackgroundImage; path_to_shader
```

---

### SetVariable
Makes a new variable with _name_ and sets it to _number_

Syntax:
```
$SetVariable;name;number
```

> The variable named "ans" is used to store the most recent answer (like in Matlab). Therefore, **don't use it**.
### $
> Yes, that is the name of the command. You have to have a ; after it

Stores the result of the _operation_ between _operand_1_ and _operand_2_ in _result_. Operands can be names of predeclared variables or just numbers.

> **Booleans are represented with 1 (true) and 0 (false)**

Syntax:
```
$$;operand_1;operator;operand_2;result
```


#### Operations

The available operations for the `$` command are:

- **+**: Adds `operand_1` and `operand_2` and stores the result in `result`.
- **-**: Subtracts `operand_2` from `operand_1` and stores the result in `result`.
- *\**: Multiplies `operand_1` by `operand_2` and stores the result in `result`.
- **/**: Divides `operand_1` by `operand_2` and stores the result in `result`.
- **>**: Checks if `operand_1` is greater than `operand_2` and stores `1` (true) or `0` (false) in `result`.
- **<**: Checks if `operand_1` is less than `operand_2` and stores `1` (true) or `0` (false) in `result`.
- **>=**: Checks if `operand_1` is greater than or equal to `operand_2` and stores `1` (true) or `0` (false) in `result`.
- **<=**: Checks if `operand_1` is less than or equal to `operand_2` and stores `1` (true) or `0` (false) in `result`.
- **=** or **==**: Checks if `operand_1` is equal to `operand_2` and stores `1` (true) or `0` (false) in `result`.

Examples:

```
$$;points;+;1;points
```

---

### SetBackgroundAmbientMusic
Plays background music. This music will loop and replace any currently playing ambient music.

Syntax:
```
$SetBackgroundAmbientMusic; path_to_music
```

---

### PlaySound
Plays a sound effect once. Does not loop.

Syntax:
```
$PlaySound; path_to_sound
```

---

### AutoContinueAfter
Use before saying a line
Will auto run the next event after speaking ends.
You can also specify a custom text speed modifier.

Syntax:
```
$AutoContinueAfter; text_speed_modifier(optional)
```

---

### FadeInScreen
Fades in a screen overlay with a title and subtitle over a specified duration. Prevents interaction while fading. Usually used when ending the story.

Syntax:
```
$FadeInScreen; title; subtitle; duration_in_ms
```

---

### FadeOutScreen
Fades out a screen overlay with a title and subtitle over a specified duration. Prevents interaction while fading. Usually used when starting the story.

Syntax:
```
$FadeOutScreen; title; subtitle; duration_in_ms
```

---

### ChangeScript
Switches to another _local_ script.

Syntax:
```
$ChangeScript; script_name
```

---

### ChangeScenario
Switches to a new scenario. _scenario_id_ is the name of the scenario folder in _static_. This will start the script according to the scenario's _metadata.json_.

Syntax:
```
$ChangeScenario; scenario_id
```

Optionally, you can also define what script in the scenario to play:

```
$ChangeScenario; scenario_id; script_name
```

---