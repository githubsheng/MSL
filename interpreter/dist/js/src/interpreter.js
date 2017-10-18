"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const commands_1 = require("./commands");
const callstack_1 = require("./callstack");
const builtIn_1 = require("./builtIn");
const PARAM_BOUND = { specialCommandName: "param_bound" };
class AbstractInterpreterState {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("operation not supported under such state");
        });
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("operation not supported under such state");
        });
    }
    stepOver() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("operation not supported under such state");
        });
    }
    restartDebug() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("operation not supported under such state");
        });
    }
    consoleEval(commandsStr) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("operation not supported under such state");
        });
    }
}
class NormalStateStart extends AbstractInterpreterState {
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
            //just so after we are done running the program user can run again.
            vm.reset();
        });
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = this.vm;
            vm.state = vm.debugStateStart;
            yield vm.state.debug();
        });
    }
    restartDebug() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.debug();
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
                    return;
                }
                else {
                    vm.commands.advanceIndex();
                    yield vm.execute(comm);
                }
            }
            //just so after we are done running the entire program in debug mode user can run again.
            vm.state = vm.normalStateStart;
            vm.reset();
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
            //if we are here then it means we cannot find any line to stop. we have gone all the way to the end of the program.
            vm.reset();
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
            this.vm.state = this.vm.normalStateStart;
            yield this.vm.normalStateStart.run();
        });
    }
    restartDebug() {
        return __awaiter(this, void 0, void 0, function* () {
            this.vm.reset();
            this.vm.state = this.vm.debugStateStart;
            yield this.vm.state.debug();
        });
    }
    consoleEval(commandsStr) {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = this.vm;
            vm.commands.parseCommandsAndAppend(commandsStr);
            const preIdx = vm.commands.getNextCommandIndex();
            vm.commands.advanceIndexForNewCommands();
            vm.callStack.getCurrentFrame().enableTempOperandStack();
            yield this.run();
            vm.callStack.getCurrentFrame().disableTempOperandStack();
            vm.state = this;
            vm.commands.setIndex(preIdx);
        });
    }
}
class Interpreter {
    constructor(commandsStr, stringConstants, sendFunc) {
        this.commands = new commands_1.Commands(commandsStr);
        this.callStack = new callstack_1.CallStack();
        this.breakPoints = new Set();
        this.debugStateStart = new DebugStateStart(this);
        this.debugStateStopped = new DebugStateStopped(this);
        this.normalStateStart = new NormalStateStart(this);
        this.stringConstants = this.parseStringConstants(stringConstants);
        this.state = this.normalStateStart;
        this.sendFunc = sendFunc;
        this.initBuiltInFunctions();
    }
    initBuiltInFunctions() {
        this.builtInFunctions = new Map();
        this.builtInFunctions.set("_print", builtIn_1._print);
        this.builtInFunctions.set("_getRandomNumber", builtIn_1._print);
        this.builtInFunctions.set("List", builtIn_1._list);
        this.builtInFunctions.set("_clock", builtIn_1._clock);
    }
    parseStringConstants(stringConstants) {
        return stringConstants.split('\n')
            .filter(line => line.trim() !== "")
            .map(str => {
            //remove the first and last " symbol
            return str.substring(1, str.length - 1);
        });
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
            if (t !== PARAM_BOUND)
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
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left >= right)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpGt(comm) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left > right)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpLe(comm) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left <= right)
            this.commands.setIndexUsingStr(comm.firstOperand);
    }
    cmpLt(comm) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left < right)
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
        console.log("survey exits");
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
            const sendFunc = this.sendFunc.bind(this);
            const answerData = yield new Promise(function (resolve, reject) {
                sendFunc(questionData, returnAnswerCallback);
                function returnAnswerCallback(answerData) {
                    resolve(answerData);
                }
            });
            this.mergeAnswerData(answerData);
        });
    }
    newScope() {
        const parent = this.callStack.getCurrentFrame();
        const newFrame = new callstack_1.FuncCallFrame(parent);
        this.callStack.addFrame(newFrame);
    }
    closeScope() {
        this.callStack.popFrame();
    }
    defineFunc(comm) {
        const funcName = comm.firstOperand;
        const startIndex = +(comm.secondOperand);
        const noOfArgs = +(comm.thirdOperand);
        const funcDef = new callstack_1.FuncDef(startIndex, noOfArgs);
        this.setInLocalVarSpace(funcName, funcDef);
    }
    invokeFunc(comm) {
        const funcName = comm.firstOperand;
        //test if the func name is a built in function, if it is, we skips the rest and just make a direct call
        if (this.builtInFunctions.has(funcName)) {
            const params = [];
            this.forEachParameters(param => {
                params.push(param);
            });
            params.reverse();
            const ret = this.builtInFunctions.get(funcName).apply(null, params);
            this.pushOperandStack(ret);
            return;
        }
        const parent = this.callStack.getCurrentFrame();
        //this is a little tricky. whenever we run a command we always immediately increment the
        //the command index. So right now the index is point at next command we will execute.
        //when this command is done, we use the index to get the next command, increment the index,
        //and start to execute the next command.
        const returnIndex = this.commands.getNextCommandIndex();
        const newFrame = new callstack_1.FuncCallFrame(parent, returnIndex);
        //it is important that for now parent is still the call at the top of call stack because
        //`this.forEachParameters` works on the frame on top of the call stack.
        this.forEachParameters((param) => {
            //transfer the params from current frame's operand stack to the new frame's
            newFrame.getOperandStack().push(param);
        });
        const funcDef = this.getFromLocalVarSpace(funcName);
        if (funcDef.noOfArgs !== newFrame.getOperandStack().length)
            throw new Error("wrong parameter numbers");
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
        params.reverse();
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
        /*
            we have to respect the order because when you add two strings a + b is
            very different from b + a
            the way the compiler generates commands is that it always first generates
            a push command to push the left operand of an add operation into the stack,
            and then generates a push command to push the right operand of the add operation
            into the stack.
            so when we pop the stack we would get the right first and then the left.
         */
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        this.pushOperandStack(left + right);
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
    newObj() {
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
    pushNull() {
        this.pushOperandStack(null);
    }
    number(comm) {
        this.pushOperandStack(+(comm.firstOperand));
    }
    store(comm) {
        const name = comm.firstOperand;
        const value = this.popOperandStack();
        this.setInLocalVarSpace(name, value);
    }
    string(comm) {
        const string = this.stringConstants[+(comm.firstOperand)];
        this.pushOperandStack(string.replace('\\n', '\n'));
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
                    return this.newObj();
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
                    return this.pushNull();
                case "number":
                    return this.number(comm);
                case "store":
                    return this.store(comm);
                case "string":
                    return this.string(comm);
            }
        });
    }
    reset() {
        this.callStack.reset();
        this.commands.reset();
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
    addBreakPoint(lineNumber) {
        this.breakPoints.add(lineNumber);
    }
    deleteBreakPoint(lineNumber) {
        this.breakPoints.delete(lineNumber);
    }
}
exports.Interpreter = Interpreter;
