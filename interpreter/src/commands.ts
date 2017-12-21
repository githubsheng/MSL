/**
 * Created by wangsheng on 14/10/17.
 */

var answer = {
    id: "q1",
    row1: {
        selected: true,
    }


}


export class Command {
    lineNumber: number;
    name: string;
    firstOperand: string;
    secondOperand: string;
    thirdOperand: string;

    constructor(lineNumber, name, firstOperand, secondOperand, thirdOperand) {
        this.lineNumber = lineNumber;
        this.name = name;
        this.firstOperand = firstOperand;
        this.secondOperand = secondOperand;
        this.thirdOperand = thirdOperand;
    }
}

export class Commands {
    //the original commands when script loads
    originalCommArrayLength: number;
    //we may append commands (generated from scripts typed in the console) to this command array
    commArray: Array<Command>;
    execIndex: number;

    constructor(commands: string) {
        this.execIndex = 0;
        this.commArray = [];
        this.parseCommandsAndAppend(commands);
        this.originalCommArrayLength = this.commArray.length;
    }

    hasNext(): boolean {
        //when we call get next we already advance the index to point to next command.
        return this.execIndex < this.commArray.length;
    }

    peekNext(): Command {
        //when we call get next we already advance the index to point to next command.
        return this.commArray[this.execIndex];
    }

    getNext(): Command {
        return this.commArray[this.execIndex++];
    }

    setIndex(index: number) {
        this.execIndex = index;
    }

    setIndexUsingStr(index: string) {
        this.execIndex = +(index);
    }

    getNextCommandIndex(): number {
        return this.execIndex;
    }

    advanceIndex() {
        this.execIndex++;
    }

    advanceIndexForNewCommands() {
        this.execIndex = this.commArray.length;
    }

    private parseCommands(commandsStr: string) {
        /*
         caution: any command would at least have a name so it cannot be an empty line
         we need to filter out the empty lines because sometimes when pasting the
         the commands string manually (in test page) we accidentally introduce some empty lines.
         */
        return commandsStr.split('\n')
            .filter(line => line.trim() !== "")
            .map(line => {
                const comps = line.split('\t');
                const lineNumber = comps[0] === "" ? undefined : +(comps[0]);
                return new Command(lineNumber, comps[1], comps[2], comps[3], comps[4]);
            });
    }

    parseCommandsAndAppend(commandsStr: string) {
        const commands = this.parseCommands(commandsStr);
        this.commArray = this.commArray.concat(commands);
    }

    reset() {
        this.execIndex = 0;
        this.commArray = this.commArray.slice(0, this.originalCommArrayLength);
    }

    end() {
        //index for next command points at undefined.
        //this allows hasNext() to properly return false when we exit the program.
        this.execIndex = this.commArray.length;
    }
}