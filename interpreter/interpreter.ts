/**
 * Created by sheng.wang on 2017/10/06.
 */
class FuncCallFrame {
    localVarSpace: Map<string, any>;
    returnIndex: number;
    parentScope: Map<string, any>;
    operandStack: Array<any>;
    tempOperandStack: Array<any>;
    endCallback: (returnIndex: number) => void;
    heap: Heap;

    constructor(heap: Heap, returnIndex?: number, parentScope?: Map<string, any>, endCallBack?: (returnIndex: number) => void){
        this.localVarSpace = new Map();
        this.returnIndex = returnIndex;
        this.parentScope = parentScope;
        this.operandStack = [];
        this.tempOperandStack = [];
        this.endCallback = endCallBack;
        this.heap = heap;
    }

    handle(command: Command) {
        //todo:
    };
    handleUsingTempOperandStack() {
        //todo:
    };
    clearTempOperandStack() {
        //todo:
    };
}

interface Command {
    lineNumber: number;
    name: string;
    firstOperand: string | number;
    secondOperand: string | number;
    thirdOperand: string | number;
}

class Interpreter {
    callStack: CallStack;
    commands: Commands;
    heap: Heap;
    global: FuncCallFrame;

    constructor(commands: string){
        this.commands = new Commands(commands);
        this.heap = new Heap();
        this.callStack = new CallStack(new FuncCallFrame(this.heap));

        this.endCall = this.endCall.bind(this);
    }

    newCall(returnIndex: number) {
        // const cur = this.getCurrentFrame();
        // this.callStack.push(new FuncCallFrame(returnIndex, cur.localVarSpace, this.endCall));
    };

    endCall(returnIndex: number) {

    };

    execute() {

    };

    debug() {

    };

    stepOver() {

    };

    setBreakPoint(lineNumber: number) {

    };

    consoleEval(commands: string) {

    };

}

class CallStack {
    stack: Array<FuncCallFrame>;
    global: FuncCallFrame;

    constructor(global: FuncCallFrame){
        this.stack = [];
        this.global = global;
        this.stack.push(global);
    }

    getCurrentFrame(): FuncCallFrame {
        return this.stack[this.stack.length - 1];
    }

    getGlobal(): FuncCallFrame {
        return this.global;
    }

}

class Commands {
    commArray: Array<Command>;
    execIndex: number;

    constructor(commands: string) {
        this.execIndex = 0;
        this.commArray = [];
        this.parseCommandsAndAppend(commands);
    }

    getNext(): Command {
        return this.commArray[++this.execIndex];
    }
    getNextIndex(): number {
        return this.execIndex + 1;
    }
    setIndex(index: number) {
        this.execIndex = index;
    }

    parseCommandsAndAppend(commands: string): Array<Command> {
        //todo:
        return null;
    }
}

class Heap {
    store: WeakMap<Address, any>;
    new(): Address {
        return null;
    }
    get(address: Address): any {
        return null;
    }
}

class Address {}

class FuncDef {
    startIndex: number;
    noOfArgs: number;
}