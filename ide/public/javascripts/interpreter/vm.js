/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const commands_1 = __webpack_require__(1);
	const callstack_1 = __webpack_require__(2);
	const builtIn_1 = __webpack_require__(3);
	const PARAM_BOUND = { specialCommandName: "param_bound" };
	class AbstractInterpreterState {
	    constructor(interpreter) {
	        this.vm = interpreter;
	    }
	    //todo: add doc for this
	    _getUnresolvedQuestionDataPromise() {
	        return new Promise((resolve, reject) => {
	            this.vm.toResolveNextQuestionData = resolve;
	        });
	    }
	    //todo: and this...
	    _getResolvedQuestionDataPromise(vmResponse) {
	        return Promise.resolve(vmResponse);
	    }
	    run() {
	        if (this.vm.isWaitingForAnswer)
	            return;
	    }
	    debug() {
	        if (this.vm.isWaitingForAnswer)
	            return;
	    }
	    stepOver() {
	        if (this.vm.isWaitingForAnswer)
	            return;
	    }
	    submitAnswer(answerData) {
	        console.log("operation not implemented!!");
	        return null;
	    }
	    restartRun(token) {
	        this.vm.state = this.vm.normalStateStart;
	        return this.vm.state.restartRun(token);
	    }
	    restartDebug(token) {
	        this.vm.state = this.vm.debugStateStart;
	        return this.vm.state.restartDebug(token);
	    }
	    consoleEval(commandsStr, stringConstsStr) {
	        const vm = this.vm;
	        const preIdx = vm.commands.getNextCommandIndex();
	        //use temp operand stack to execute run the evaluation
	        vm.commands.advanceIndexForNewCommands();
	        vm.commands.parseCommandsAndAppend(commandsStr);
	        vm.parseStringConstantsAndAppend(stringConstsStr);
	        vm.callStack.getCurrentFrame().enableTempOperandStack();
	        while (vm.commands.hasNext()) {
	            const comm = vm.commands.getNext();
	            vm.execute(comm);
	        }
	        //finally, we need to print out whatever is at the head of the operand stack...
	        const ret = vm.callStack.getCurrentFrame().getOperandStack().pop();
	        vm.output ? vm.output(ret) : builtIn_1._print(ret);
	        vm.callStack.getCurrentFrame().disableTempOperandStack();
	        vm.callStack.getCurrentFrame().resetTempOperandStack();
	        vm.commands.setIndex(preIdx);
	    }
	}
	class NormalStateStart extends AbstractInterpreterState {
	    constructor(interpreter) {
	        super(interpreter);
	    }
	    _run(sendQuestionCommListener) {
	        const vm = this.vm;
	        //as long as there are commands, execute the commands
	        while (vm.commands.hasNext()) {
	            const comm = vm.commands.getNext();
	            const ret = vm.execute(comm);
	            if (ret)
	                return sendQuestionCommListener(ret);
	        }
	        //to signal UI that there is no more next question.
	        return Promise.resolve({
	            token: vm.token,
	            pageInfo: {},
	            questions: []
	        });
	    }
	    run() {
	        const vm = this.vm;
	        if (vm.isWaitingForAnswer)
	            return;
	        return this._run(vm.resolvePreviousPromise.bind(vm));
	    }
	    /*
	    (in NormalStateStart) submit answer -> send question -> return promise of next question (resolved, since we already have the question data now)
	     */
	    submitAnswer(answerData) {
	        if (!this.vm.isWaitingForAnswer)
	            return;
	        this.vm.mergeAnswerData(answerData);
	        return this._run(this._getResolvedQuestionDataPromise.bind(this));
	    }
	    restartRun(token) {
	        this.vm.reset();
	        this.vm.token = token;
	        return this._run(this._getResolvedQuestionDataPromise.bind(this));
	    }
	}
	class DebugStateStart extends AbstractInterpreterState {
	    constructor(interpreter) {
	        super(interpreter);
	    }
	    _debug(breakPointListener, sendQuestionCommListener) {
	        const vm = this.vm;
	        while (vm.commands.hasNext()) {
	            const comm = vm.commands.peekNext();
	            if (vm.breakPoints.has(comm.lineNumber)) {
	                vm.state = vm.debugStateStopped;
	                vm.debugStateStopped.stoppedAt = comm.lineNumber;
	                vm.stoppedAtBreakpointCallback(comm.lineNumber);
	                if (breakPointListener) {
	                    return breakPointListener();
	                }
	                else {
	                    return;
	                }
	            }
	            else {
	                vm.commands.advanceIndex();
	                const ret = vm.execute(comm);
	                if (ret && sendQuestionCommListener)
	                    return sendQuestionCommListener(ret);
	            }
	        }
	        //indicate that there is no more questions.
	        return Promise.resolve({
	            token: vm.token,
	            pageInfo: {},
	            questions: []
	        });
	    }
	    debug() {
	        if (this.vm.isWaitingForAnswer)
	            return;
	        //when sees a break point, do nothing, when sees a sendQuestion, resolve the previous promise.
	        return this._debug(null, this.vm.resolvePreviousPromise.bind(this.vm));
	    }
	    /*
	    (In DebugStateStart) submit answer -> hit a break point -> return promise of next question  -> run / debug / step over
	    (In DebugStateStart) submit answer -> sendQuestion -> return resolved promise of next question (since we already have the data of next question)
	     */
	    submitAnswer(answerData) {
	        if (!this.vm.isWaitingForAnswer)
	            return;
	        this.vm.mergeAnswerData(answerData);
	        return this._debug(this._getUnresolvedQuestionDataPromise.bind(this), this._getResolvedQuestionDataPromise.bind(this));
	    }
	    restartDebug(token) {
	        this.vm.reset();
	        this.vm.token = token;
	        return this._debug(this._getUnresolvedQuestionDataPromise.bind(this), this._getResolvedQuestionDataPromise.bind(this));
	    }
	}
	class DebugStateStopped extends AbstractInterpreterState {
	    constructor(interpreter) {
	        super(interpreter);
	    }
	    /**
	     * steps over the current line.
	     * @returns {Promise<void>}
	     * @private
	     */
	    _stepOverCurrentLine() {
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

	                 notice that we can never set a break point at question definition so that we do not need to concern about sending question data.
	                 */
	                vm.commands.advanceIndex();
	                vm.execute(comm);
	            }
	            else {
	                /*
	                 we have stepped over the current break point.
	                 */
	                return;
	            }
	        }
	    }
	    _stopAtNextStoppableLine(breakPointListener, sendQuestionCommListener) {
	        const vm = this.vm;
	        while (vm.commands.hasNext()) {
	            const comm = vm.commands.peekNext();
	            if (comm.lineNumber >= 0) {
	                //this is a line where we can set a break point, stop at this line (do not execute this line)
	                this.stoppedAt = comm.lineNumber;
	                vm.stoppedAtBreakpointCallback(comm.lineNumber);
	                if (breakPointListener) {
	                    return breakPointListener();
	                }
	                else {
	                    return;
	                }
	            }
	            else {
	                //we cannot set a break point here, do not stop.
	                vm.commands.advanceIndex();
	                const ret = vm.execute(comm);
	                if (ret)
	                    return sendQuestionCommListener(ret);
	            }
	        }
	        //if we are here then it means we cannot find any line to stop. we have gone all the way to the end of the program.
	        vm.reset();
	        //indicate that there is no more questions.
	        return Promise.resolve({
	            token: vm.token,
	            pageInfo: {},
	            questions: []
	        });
	    }
	    /**
	     * steps over the current line and continue to execute until it reaches another line that we can set a break point.
	     * @returns {Promise<void>}
	     */
	    stepOver() {
	        if (this.vm.isWaitingForAnswer)
	            return;
	        this._stepOverCurrentLine();
	        this._stopAtNextStoppableLine(null, this.vm.resolvePreviousPromise.bind(this.vm));
	    }
	    //when we stopped at a beak point we can choose to resume debug
	    debug() {
	        const vm = this.vm;
	        if (vm.isWaitingForAnswer)
	            return;
	        this._stepOverCurrentLine();
	        //continue to execute until it stops at another break point
	        vm.state = vm.debugStateStart;
	        return vm.state.debug();
	    }
	    run() {
	        const vm = this.vm;
	        if (vm.isWaitingForAnswer)
	            return;
	        this._stepOverCurrentLine();
	        vm.state = vm.normalStateStart;
	        return vm.state.run();
	    }
	    /*
	    (in DebugStateStopped) submit answer -> hit a line where we can set a break point -> returns the promise of next question -> run / debug / step over
	    (in DebugStateStopped) submit answer -> sendQuestion -> returns a resolved promise of next question (since we already know the question data)
	     */
	    submitAnswer(answerData) {
	        if (!this.vm.isWaitingForAnswer)
	            return;
	        this.vm.mergeAnswerData(answerData);
	        return this._stopAtNextStoppableLine(this._getUnresolvedQuestionDataPromise.bind(this), this._getResolvedQuestionDataPromise.bind(this));
	    }
	}
	class Interpreter {
	    constructor(commandsStr, stringConstants, output, stoppedAtBreakpointCallback) {
	        this.commands = new commands_1.Commands(commandsStr);
	        this.callStack = new callstack_1.CallStack();
	        this.breakPoints = new Set();
	        this.debugStateStart = new DebugStateStart(this);
	        this.debugStateStopped = new DebugStateStopped(this);
	        this.normalStateStart = new NormalStateStart(this);
	        this.parseStringConstantsAndAppend(stringConstants);
	        this.state = this.normalStateStart;
	        this.isWaitingForAnswer = false;
	        this.output = output;
	        this.stoppedAtBreakpointCallback = stoppedAtBreakpointCallback;
	        this.initBuiltInFunctions();
	    }
	    initBuiltInFunctions() {
	        this.builtInFunctions = new Map();
	        this.builtInFunctions.set("_print", this.output ? this.output : builtIn_1._print);
	        this.builtInFunctions.set("_getRandomNumber", builtIn_1._getRandomNumber);
	        this.builtInFunctions.set("List", builtIn_1._list);
	        this.builtInFunctions.set("_clock", builtIn_1._clock);
	    }
	    parseStringConstantsAndAppend(stringConstants) {
	        const strConsts = stringConstants.split('\n')
	            .map(line => line.trim())
	            .filter(line => line !== "")
	            .map(str => {
	            /*
	             remove the first and last " symbol
	             */
	            return str.substring(1, str.length - 1);
	        });
	        if (!this.stringConstants)
	            this.stringConstants = [];
	        this.stringConstants = this.stringConstants.concat(strConsts);
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
	    //if equal to 0, that is, if false
	    //in the very beginning we use 0 for false, and 1 for true, but now we use boolean instead
	    //so this is kinda of legacy name
	    ifEq(comm) {
	        const t = this.popOperandStack();
	        if (t === false)
	            this.commands.setIndexUsingStr(comm.firstOperand);
	    }
	    //if not equal to 0, that is, if true
	    //in the very beginning we use 0 for false, and 1 for true, but now we use boolean instead
	    //so this is kinda of legacy name
	    ifNe(comm) {
	        const t = this.popOperandStack();
	        if (t === true)
	            this.commands.setIndexUsingStr(comm.firstOperand);
	    }
	    sendQuestion() {
	        const questions = [];
	        this.forEachParameters((param) => {
	            //here params being question references..
	            questions.push(param);
	        });
	        //q1, q2, and q3 are pushed to the stack like q1 -> q2 -> q3 and when popping them, order becomes q3, q2, q1.
	        questions.reverse();
	        this.isWaitingForAnswer = true;
	        return {
	            token: this.token,
	            questions: questions,
	            pageInfo: this.getFromLocalVarSpace("_pagePropObj"),
	            pageGroupInfo: this.getFromLocalVarSpace("_pageGroupObj")
	        };
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
	    boolean(comm) {
	        const bool = comm.firstOperand === "true";
	        this.pushOperandStack(bool);
	    }
	    execute(comm) {
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
	            case "bool":
	                return this.boolean(comm);
	            case "string":
	                return this.string(comm);
	        }
	    }
	    mergeAnswerData(answerData) {
	        answerData.forEach(q => this.setInGlobalVarSpace(q.id, q));
	        this.isWaitingForAnswer = false;
	    }
	    reset() {
	        this.isWaitingForAnswer = false;
	        //if we have pending promise that needs to resolve, resolve it first...
	        if (this.toResolveNextQuestionData)
	            this.toResolveNextQuestionData(null);
	        this.callStack.reset();
	        this.commands.reset();
	    }
	    run() {
	        this.state.run();
	    }
	    debug() {
	        this.state.debug();
	    }
	    stepOver() {
	        this.state.stepOver();
	    }
	    restartRun(token) {
	        return this.state.restartRun(token);
	    }
	    restartDebug(token) {
	        return this.state.restartDebug(token);
	    }
	    submitAnswer(answerData) {
	        return this.state.submitAnswer(answerData);
	    }
	    consoleEval(commandsStr, stringConstsStr) {
	        this.state.consoleEval(commandsStr, stringConstsStr);
	    }
	    addBreakPoint(lineNumber) {
	        this.breakPoints.add(lineNumber);
	    }
	    deleteBreakPoint(lineNumber) {
	        this.breakPoints.delete(lineNumber);
	    }
	    resolvePreviousPromise(vmResponse) {
	        this.toResolveNextQuestionData(vmResponse);
	        this.toResolveNextQuestionData = null;
	    }
	}
	exports.Interpreter = Interpreter;
	window.Interpreter = Interpreter;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

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
	    parseCommands(commandsStr) {
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
	    parseCommandsAndAppend(commandsStr) {
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
	exports.Commands = Commands;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
	    resetTempOperandStack() {
	        this.tempOperandStack = [];
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
	        const ret = this.localVarSpace.get(key);
	        //if this variable is not defined in the current scope, try its parent scope.
	        if (ret === undefined && this.parent)
	            return this.parent.putInSpace(key, value);
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


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	class List {
	    constructor(elements) {
	        this._elements = elements;
	    }
	    get(index) {
	        return this._elements[index];
	    }
	    //todo: in the future we may not use 0 and 1 for booleans
	    has(el) {
	        const t = this._elements.indexOf(el);
	        return t === -1 ? 0 : 1;
	    }
	    indexOf(el) {
	        return this._elements.indexOf(el);
	    }
	    add(el) {
	        this._elements.push(el);
	    }
	    addFirst(el) {
	        this._elements.splice(0, 0, el);
	    }
	    addLast(el) {
	        this.add(el);
	    }
	    addAllFirst(list) {
	        this._elements.unshift(list._elements);
	    }
	    addAllLast(list) {
	        const s = this._elements.length;
	        this._elements.splice(s, 0, ...list._elements);
	    }
	    set(index, el) {
	        this._elements[index] = el;
	    }
	    addAt(index, el) {
	        this._elements.splice(index, 0, el);
	    }
	    removeFirst() {
	        this._elements.shift();
	    }
	    removeLast() {
	        this._elements.pop();
	    }
	    remove(el) {
	        const i = this._elements.indexOf(el);
	        if (i !== -1)
	            this._elements.splice(i, 1);
	    }
	    removeAt(index) {
	        this._elements.splice(index, 1);
	    }
	    clear() {
	        this._elements = [];
	    }
	    randomize() {
	        //for each element in the list, swap its position with another random element.
	        for (let i = 0; i < this._elements.length; i++) {
	            const t1 = this._elements[i];
	            const t2i = _getRandomNumber(0, this._elements.length);
	            const t2 = this._elements[t2i];
	            this._elements[i] = t2;
	            this._elements[t2i] = t1;
	        }
	    }
	    rotate() {
	        let r = _getRandomNumber(0, this._elements.length);
	        while (r > 0) {
	            let h = this._elements.shift();
	            this._elements.push(h);
	            r--;
	        }
	    }
	    get size() {
	        return this._elements.length;
	    }
	}
	exports.List = List;
	function _print(something) {
	    console.log(something);
	}
	exports._print = _print;
	function _getRandomNumber(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min)) + min;
	}
	exports._getRandomNumber = _getRandomNumber;
	function _list(...elements) {
	    return new List(elements);
	}
	exports._list = _list;
	function _clock() {
	    const now = new Date();
	    return now.getHours();
	}
	exports._clock = _clock;


/***/ })
/******/ ]);