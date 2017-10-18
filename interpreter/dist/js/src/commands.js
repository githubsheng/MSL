/**
 * Created by wangsheng on 14/10/17.
 */
"use strict";
class Command {
    constructor(lineNumber, name, firstOperand, secondOperand, thirdOperand) {
        this.lineNumber = lineNumber;
        this.name = name;
        this.firstOperand = firstOperand;
        this.secondOperand = secondOperand;
        this.thirdOperand = thirdOperand;
    }
}
exports.Command = Command;
class Commands {
    constructor(commands) {
        this.execIndex = 0;
        this.commArray = [];
        this.parseCommandsAndAppend(commands);
        this.originalCommArrayLength = this.commArray.length;
    }
    hasNext() {
        //when we call get next we already advance the index to point to next command.
        return this.execIndex < this.commArray.length;
    }
    peekNext() {
        //when we call get next we already advance the index to point to next command.
        return this.commArray[this.execIndex];
    }
    getNext() {
        return this.commArray[this.execIndex++];
    }
    setIndex(index) {
        this.execIndex = index;
    }
    setIndexUsingStr(index) {
        this.execIndex = +(index);
    }
    getNextCommandIndex() {
        return this.execIndex;
    }
    advanceIndex() {
        this.execIndex++;
    }
    advanceIndexForNewCommands() {
        this.execIndex = this.commArray.length;
    }
    parseCommandsAndAppend(commandsStr) {
        this.commArray = commandsStr.split('\n')
            .filter(line => line.trim() !== "")
            .map(line => {
            const comps = line.split('\t');
            const lineNumber = comps[0] === "" ? undefined : +(comps[0]);
            return new Command(lineNumber, comps[1], comps[2], comps[3], comps[4]);
        });
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
exports.Commands = Commands;
