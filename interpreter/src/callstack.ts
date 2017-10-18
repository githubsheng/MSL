export class FuncCallFrame {
    returnIndex: number;
    parent: FuncCallFrame;
    private localVarSpace: Map<string, any>;
    private operandStack: Array<any>;
    private tempOperandStack: Array<any>;
    private isUsingTempOperandStack: boolean;

    constructor(parent?: FuncCallFrame, returnIndex?: number) {
        this.localVarSpace = new Map();
        this.returnIndex = returnIndex;
        this.parent = parent;
        this.operandStack = [];
        this.tempOperandStack = [];
    }

    enableTempOperandStack() {
        this.isUsingTempOperandStack = true;
    }

    disableTempOperandStack() {
        this.isUsingTempOperandStack = false;
    }

    getOperandStack() {
        return this.isUsingTempOperandStack ? this.tempOperandStack : this.operandStack;
    }

    getFromSpace(key: string): any {
        const ret = this.localVarSpace.get(key);
        if(ret === undefined && this.parent) return this.parent.getFromSpace(key);
        return ret;
    }

    putInSpace(key: string, value: any) {
        this.localVarSpace.set(key, value);
    }
}



export class FuncDef {
    startIndex: number;
    noOfArgs: number;

    constructor(startIndex, noOfArgs) {
        this.startIndex = startIndex;
        this.noOfArgs = noOfArgs;
    }
}

export class CallStack {
    stack: Array<FuncCallFrame>;
    global: FuncCallFrame;

    constructor() {
        this.reset();
    }

    addFrame(frame: FuncCallFrame) {
        this.stack.push(frame);
    }

    popFrame(): FuncCallFrame {
        return this.stack.pop();
    }

    getCurrentFrame(): FuncCallFrame {
        return this.stack[this.stack.length - 1];
    }

    getGlobal(): FuncCallFrame {
        return this.global;
    }

    reset() {
        this.stack = [];
        this.global = new FuncCallFrame();
        this.stack.push(this.global);
    }

}