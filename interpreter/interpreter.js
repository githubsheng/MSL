/**
 * Created by sheng.wang on 2017/10/06.
 */
class FuncCallFrame {
    constructor(heap, returnIndex, parentScope, endCallBack) {
        this.localVarSpace = new Map();
        this.returnIndex = returnIndex;
        this.parentScope = parentScope;
        this.operandStack = [];
        this.tempOperandStack = [];
        this.endCallback = endCallBack;
        this.heap = heap;
    }
    handle(command) {
        //todo:
    }
    ;
    handleUsingTempOperandStack() {
        //todo:
    }
    ;
    clearTempOperandStack() {
        //todo:
    }
    ;
}
class Interpreter {
    constructor(commands) {
        this.commands = new Commands(commands);
        this.heap = new Heap();
        this.callStack = new CallStack(new FuncCallFrame(this.heap));
        this.endCall = this.endCall.bind(this);
    }
    newCall(returnIndex) {
        // const cur = this.getCurrentFrame();
        // this.callStack.push(new FuncCallFrame(returnIndex, cur.localVarSpace, this.endCall));
    }
    ;
    endCall(returnIndex) {
    }
    ;
    execute() {
    }
    ;
    debug() {
    }
    ;
    stepOver() {
    }
    ;
    setBreakPoint(lineNumber) {
    }
    ;
    consoleEval(commands) {
    }
    ;
}
class CallStack {
    constructor(global) {
        this.stack = [];
        this.global = global;
        this.stack.push(global);
    }
    getCurrentFrame() {
        return this.stack[this.stack.length - 1];
    }
    getGlobal() {
        return this.global;
    }
}
class Commands {
    constructor(commands) {
        this.execIndex = 0;
        this.commArray = [];
        this.parseCommandsAndAppend(commands);
    }
    getNext() {
        return this.commArray[++this.execIndex];
    }
    getNextIndex() {
        return this.execIndex + 1;
    }
    setIndex(index) {
        this.execIndex = index;
    }
    parseCommandsAndAppend(commands) {
        //todo:
        return null;
    }
}
class Heap {
    new() {
        return null;
    }
    get(address) {
        return null;
    }
}
class Address {
}
class FuncDef {
}
//# sourceMappingURL=interpreter.js.map