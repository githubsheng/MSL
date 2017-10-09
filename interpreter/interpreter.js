var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const PARAM_BOUND = { specialCommandName: "param_bound" };
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
        if (!ret && this.parent)
            return this.parent.getFromSpace(key);
        return undefined;
    }
    putInSpace(key, value) {
        this.localVarSpace.set(key, value);
    }
}
class FuncDef {
    constructor(startIndex, noOfArgs) {
        this.startIndex = startIndex;
        this.noOfArgs = noOfArgs;
    }
}
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
class Commands {
    constructor(commands) {
        this.execIndex = 0;
        this.commArray = [];
        this.parseCommandsAndAppend(commands);
        this.originalCommArrayLength = this.commArray.length;
    }
    hasNext() {
        return this.execIndex < this.commArray.length - 1;
    }
    peekNext() {
        return this.commArray[this.execIndex + 1];
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
    setIndexUsingStr(index) {
        this.execIndex = +(index);
    }
    getCurrentIndex() {
        return this.execIndex;
    }
    advanceIndex() {
        this.execIndex++;
    }
    advanceIndexForNewCommands() {
        this.execIndex = this.commArray.length;
    }
    parseCommandsAndAppend(commandsStr) {
        //todo: we need both string constants and commands string
    }
    reset() {
        this.execIndex = 0;
        this.commArray = this.commArray.slice(0, this.originalCommArrayLength);
    }
    end() {
        this.execIndex = this.commArray.length - 1;
    }
}
class AbstractInterpreterState {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("illegal state");
        });
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("illegal state");
        });
    }
    stepOver() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("illegal state");
        });
    }
    restartDebug() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("illegal state");
        });
    }
    consoleEval(commandsStr) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("illegal state");
        });
    }
}
class DebugStateStart extends AbstractInterpreterState {
    constructor(interpreter) {
        super();
        this.vm = interpreter;
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = this.vm;
            while (vm.commands.hasNext()) {
                const comm = vm.commands.peekNext();
                if (vm.breakPoints.has(comm.lineNumber)) {
                    vm.state = vm.debugStateStopped;
                    vm.debugStateStopped.stoppedAt = comm.lineNumber;
                }
                else {
                    vm.commands.advanceIndex();
                    yield vm.execute(comm);
                }
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.vm.state = this.vm.normalStateRun;
            yield this.vm.normalStateRun.run();
        });
    }
    restartDebug() {
        return __awaiter(this, void 0, void 0, function* () {
            this.vm.commands.reset();
            this.vm.callStack.reset();
            yield this.debug();
        });
    }
}
class DebugStateStopped extends AbstractInterpreterState {
    constructor(interpreter) {
        super();
        this.vm = interpreter;
    }
    /**
     * steps over the current line.
     * @returns {Promise<void>}
     * @private
     */
    _stepOver() {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = this.vm;
            const stoppedAt = this.stoppedAt;
            while (vm.commands.hasNext()) {
                const comm = vm.commands.peekNext();
                if (comm.lineNumber === stoppedAt) {
                    /*
                     execute all commands that originates from the same line we have stopped at.
                     the line number pattern for commands would be like this:
                     comm1 : line 1
                     comm2 : line 1
                     comm3 : line 1
                     comm4 : <<no line number, we cannot set break points here>>
                     comm5 : <<no line number, we cannot set break points here>>
                     comm6 : line 2
                     comm7 : line 2
                     comm8 : line 7
                     comm9 : line 7
                     comm6 : line 2 -> @1
                     comm7 : line 2
                     If we set a break point of 2, then at the beginning of this state we are at comm5. At this stage, `stoppedAt` will be 2, meaning that
                     we have stopped at line 2 (stopped at line 2 meaning stop and don't execute line 2 yet). Now if we step over, we need to execute all
                     immediately following commands that originate from line 2.
    
                     @1
                     here flow control may branch back to (comm6, line2). But it is certain there must be some other commands in between these two line 2 blocks.
                     */
                    vm.commands.advanceIndex();
                    yield vm.execute(comm);
                }
                else {
                    /*
                     we have stepped over the current break point.
                     */
                    return;
                }
            }
        });
    }
    /**
     * steps over the current line and continue to execute until it reaches another line that we can set a break point.
     * @returns {Promise<void>}
     */
    stepOver() {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = this.vm;
            yield this._stepOver();
            while (vm.commands.hasNext()) {
                const comm = vm.commands.peekNext();
                if (comm.lineNumber >= 0) {
                    //this is a line where we can set a break point, stop at this line (do not execute this line)
                    this.stoppedAt = comm.lineNumber;
                    return;
                }
                else {
                    //we cannot set a break point here, do not stop.
                    vm.commands.advanceIndex();
                    yield vm.execute(comm);
                }
            }
        });
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._stepOver();
            //continue to execute until it stops at another break point
            this.vm.state = this.vm.debugStateStart;
            yield this.vm.state.debug();
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.vm.state = this.vm.normalStateRun;
            yield this.vm.normalStateRun.run();
        });
    }
    restartDebug() {
        return __awaiter(this, void 0, void 0, function* () {
            this.vm.commands.reset();
            this.vm.callStack.reset();
            this.vm.state = this.vm.debugStateStart;
            yield this.vm.state.debug();
        });
    }
    consoleEval(commandsStr) {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = this.vm;
            vm.commands.parseCommandsAndAppend(commandsStr);
            const curIdx = vm.commands.getCurrentIndex();
            vm.commands.advanceIndexForNewCommands();
            vm.callStack.getCurrentFrame().enableTempOperandStack();
            yield this.run();
            vm.callStack.getCurrentFrame().disableTempOperandStack();
            vm.state = this;
            vm.commands.setIndex(curIdx);
        });
    }
}
class NormalStateRun extends AbstractInterpreterState {
    constructor(interpreter) {
        super();
        this.vm = interpreter;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = this.vm;
            //as long as there are commands, execute the commands
            while (vm.commands.hasNext()) {
                const comm = vm.commands.getNext();
                yield vm.execute(comm);
            }
        });
    }
}
class Interpreter {
    constructor(commandsStr, stringConstants) {
        this.commands = new Commands(commandsStr);
        this.callStack = new CallStack();
        this.breakPoints = new Set();
        this.debugStateStart = new DebugStateStart(this);
        this.debugStateStopped = new DebugStateStopped(this);
        this.normalStateRun = new NormalStateRun(this);
        this.stringConstants = stringConstants.split('\n');
    }
    popOperandStack() {
        return this.callStack.getCurrentFrame().getOperandStack().pop();
    }
    pushOperandStack(val) {
        return this.callStack.getCurrentFrame().getOperandStack().push(val);
    }
    getFromLocalVarSpace(key) {
        return this.callStack.getCurrentFrame().getFromSpace(key);
    }
    setInLocalVarSpace(key, val) {
        this.callStack.getCurrentFrame().putInSpace(key, val);
    }
    setInGlobalVarSpace(key, val) {
        this.callStack.getGlobal().putInSpace(key, val);
    }
    getFromGlobalVarSpace(key) {
        return this.callStack.global.getFromSpace(key);
    }
    forEachParameters(func) {
        let t;
        do {
            t = this.popOperandStack();
            func(t);
        } while (t !== PARAM_BOUND);
    }
    cmpEq(comm) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 === t2)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpGe(comm) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 >= t2)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpGt(comm) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 > t2)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpLe(comm) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 <= t2)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpLt(comm) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 < t2)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpNe(comm) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 !== t2)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    end() {
        this.commands.end();
    }
    goTo(comm) {
        this.commands.setIndexUsingStr(comm.firstOperand);
    }
    ifEq(comm) {
        const t = this.popOperandStack();
        if (t === 0)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    ifNe(comm) {
        const t = this.popOperandStack();
        if (t !== 0)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    mergeAnswerData(answerData) {
        //todo:
    }
    sendQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            const questionData = [];
            this.forEachParameters((param) => {
                //here params being question references..
                questionData.push(param);
            });
            const answerData = yield this.sendFunc(questionData);
            this.mergeAnswerData(answerData);
        });
    }
    newScope() {
        const parent = this.callStack.getCurrentFrame();
        const newFrame = new FuncCallFrame(parent);
        this.callStack.addFrame(newFrame);
    }
    closeScope() {
        this.callStack.popFrame();
    }
    defineFunc(comm) {
        const funcName = comm.firstOperand;
        const startIndex = +(comm.secondOperand);
        const noOfArgs = +(comm.thirdOperand);
        const funcDef = new FuncDef(startIndex, noOfArgs);
        this.setInLocalVarSpace(funcName, funcDef);
    }
    invokeFunc(comm) {
        const parent = this.callStack.getCurrentFrame();
        const returnIndex = this.commands.getNextIndex();
        const newFrame = new FuncCallFrame(parent, returnIndex);
        //it is important that for now parent is still the call at the top of call stack because
        //`this.forEachParameters` works on the frame on top of the call stack.
        this.forEachParameters((param) => {
            //transfer the params from current frame's operand stack to the new frame's
            newFrame.getOperandStack().push(param);
        });
        const funcName = comm.firstOperand;
        const funcDef = this.getFromGlobalVarSpace(funcName);
        this.commands.setIndex(funcDef.startIndex);
        this.callStack.addFrame(newFrame);
    }
    invokeMethod(comm) {
        //for now we only allow invoking methods on built in objects
        //built in objects are only in global var space
        //this is a shortcut
        const params = [];
        this.forEachParameters(param => {
            params.push(param);
        });
        const thisArgReference = this.popOperandStack();
        const methodName = comm.firstOperand;
        const ret = thisArgReference[methodName].apply(thisArgReference, params);
        this.pushOperandStack(ret);
    }
    paramBound() {
        this.pushOperandStack(PARAM_BOUND);
    }
    returnNull() {
        const frame = this.callStack.popFrame();
        this.pushOperandStack(undefined);
        this.commands.setIndex(frame.returnIndex);
    }
    returnVal() {
        const ret = this.popOperandStack();
        const frame = this.callStack.popFrame();
        this.pushOperandStack(ret);
        this.commands.setIndex(frame.returnIndex);
    }
    add() {
        this.pushOperandStack(this.popOperandStack() + this.popOperandStack());
    }
    div() {
        this.pushOperandStack(this.popOperandStack() / this.popOperandStack());
    }
    inc(comm) {
        const incremented = this.getFromLocalVarSpace(comm.firstOperand) + 1;
        this.setInLocalVarSpace(comm.firstOperand, incremented);
    }
    mod() {
        this.pushOperandStack(this.popOperandStack() % this.popOperandStack());
    }
    mul() {
        this.pushOperandStack(this.popOperandStack() * this.popOperandStack());
    }
    neg(comm) {
        const neg = -this.getFromLocalVarSpace(comm.firstOperand);
        this.setInLocalVarSpace(comm.firstOperand, neg);
    }
    sub() {
        this.pushOperandStack(this.popOperandStack() - this.popOperandStack());
    }
    dup() {
        const t = this.popOperandStack();
        this.pushOperandStack(t);
        this.pushOperandStack(t);
    }
    new() {
        this.pushOperandStack({});
    }
    putField(comm) {
        const value = this.popOperandStack();
        const obj = this.popOperandStack();
        const fieldName = comm.firstOperand;
        obj[fieldName] = value;
    }
    readField(comm) {
        const obj = this.popOperandStack();
        const value = obj[comm.firstOperand];
        this.pushOperandStack(value);
    }
    aLoad() {
        const index = this.popOperandStack();
        const list = this.popOperandStack();
        this.pushOperandStack(list.get(index));
    }
    empty() {
        return;
    }
    gStore(comm) {
        const name = comm.firstOperand;
        const value = this.popOperandStack();
        this.setInGlobalVarSpace(name, value);
    }
    load(comm) {
        const name = comm.firstOperand;
        this.pushOperandStack(this.getFromLocalVarSpace(name));
    }
    null() {
        this.pushOperandStack(null);
    }
    number(comm) {
        this.pushOperandStack(+(comm));
    }
    store(comm) {
        const name = comm.firstOperand;
        const value = this.popOperandStack();
        this.setInLocalVarSpace(name, value);
    }
    string(comm) {
        const string = this.stringConstants[+(comm.firstOperand)];
        this.pushOperandStack(string);
    }
    execute(comm) {
        return __awaiter(this, void 0, void 0, function* () {
            //todo: big giant switch case...
            switch (comm.name) {
                case "await":
                    //todo: this command is not useful, remove it from compiler
                    return;
                case "cmp_eq":
                    return this.cmpEq(comm);
                case "cmp_ge":
                    return this.cmpGe(comm);
                case "cmp_gt":
                    return this.cmpGt(comm);
                case "cmp_le":
                    return this.cmpLe(comm);
                case "cmp_lt":
                    return this.cmpLt(comm);
                case "cmp_ne":
                    return this.cmpNe(comm);
                case "exit_program":
                    return this.end();
                case "go_to":
                    return this.goTo(comm);
                case "if_eq_0":
                    return this.ifEq(comm);
                case "if_ne_0":
                    return this.ifNe(comm);
                case "send_question":
                    return this.sendQuestion();
                case "new_scope":
                    return this.newScope();
                case "close_scope":
                    return this.closeScope();
                case "def_func":
                    return this.defineFunc(comm);
                case "invoke_func":
                    return this.invokeFunc(comm);
                case "invoke_method":
                    return this.invokeMethod(comm);
                case "param_bound":
                    return this.paramBound();
                case "return_null":
                    return this.returnNull();
                case "return_val":
                    return this.returnVal();
                case "add":
                    return this.add();
                case "div":
                    return this.div();
                case "inc":
                    return this.inc(comm);
                case "mod":
                    return this.mod();
                case "mul":
                    return this.mul();
                case "neg":
                    return this.neg(comm);
                case "sub":
                    return this.sub();
                case "dup":
                    return this.dup();
                case "new":
                    return this.new();
                case "put_field":
                    return this.putField(comm);
                case "read_field":
                    return this.readField(comm);
                case "a_load":
                    return this.aLoad();
                case "empty":
                    return this.empty();
                case "g_store":
                    return this.gStore(comm);
                case "load":
                    return this.load(comm);
                case "null":
                    return this.null();
                case "number":
                    return this.number(comm);
                case "store":
                    return this.store(comm);
                case "string":
                    return this.string(comm);
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.state.run();
        });
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.state.debug();
        });
    }
    restartDebug() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.state.restartDebug();
        });
    }
    stepOver() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.state.stepOver();
        });
    }
    consoleEval(commandsStr) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.state.consoleEval(commandsStr);
        });
    }
}
// //todo: this should be one of the execute logic
// function newCall() {
//     const cur = callStack.getCurrentFrame();
//     const retIdx = commands.getNextIndex();
//     callStack.addFrame(new FuncCallFrame(retIdx, cur.localVarSpace));
// }
//
// //todo: this should be one of the execute logic
// function endCall(){
//     const fr = callStack.popFrame();
//     commands.setIndex(fr.returnIndex);
// }
//# sourceMappingURL=interpreter.js.map