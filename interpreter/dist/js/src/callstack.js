"use strict";
class FuncCallFrame {
    constructor(parent, returnIndex) {
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
    getFromSpace(key) {
        const ret = this.localVarSpace.get(key);
        if (ret === undefined && this.parent)
            return this.parent.getFromSpace(key);
        return ret;
    }
    putInSpace(key, value) {
        this.localVarSpace.set(key, value);
    }
}
exports.FuncCallFrame = FuncCallFrame;
class FuncDef {
    constructor(startIndex, noOfArgs) {
        this.startIndex = startIndex;
        this.noOfArgs = noOfArgs;
    }
}
exports.FuncDef = FuncDef;
class CallStack {
    constructor() {
        this.reset();
    }
    addFrame(frame) {
        this.stack.push(frame);
    }
    popFrame() {
        return this.stack.pop();
    }
    getCurrentFrame() {
        return this.stack[this.stack.length - 1];
    }
    getGlobal() {
        return this.global;
    }
    reset() {
        this.stack = [];
        this.global = new FuncCallFrame();
        this.stack.push(this.global);
    }
}
exports.CallStack = CallStack;
