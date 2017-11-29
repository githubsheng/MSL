import {Commands, Command} from "./commands";
import {CallStack, FuncCallFrame, FuncDef} from "./callstack";
import {List, _print, _list, _clock, _getRandomNumber} from "./builtIn";
import {RowsOnly, Matrix, Question, Row, Col, VMResponse} from "./questionTypes";
const PARAM_BOUND = {specialCommandName: "param_bound"};

/*
 flow examples:
 1. restartDebug -> hit a break point -> return promise -> run -> sees sendQuestion -> resolves promise -> submit answer...
 2. restartDebug -> hit a break point -> return promise -> step over -> run -> sees sendQuestion -> resolves promise -> submit answer...
 3. restartDebug -> hit a break point -> return promise -> debug -> hit a break point -> run -> sees sendQuestion
 -> resolves promise -> submit answer...
 4. restartDebug -> hit a break point -> return promise#1 -> step over -> sees sendQuestion -> resolves promise#1 -> submit answer
 -> hit a potential break point (line which we can set a beak point) -> return promise#2 -> step over -> step over -> run
 -> sees sendQuestion -> resolves promise#2 -> submit answer...
 5. restartDebug -> sees sendQuestion -> return resolved promise#1 -> submit answer -> hit a break point -> return promise#2
 -> run -> sees sendQuestion -> resolves promise#2 -> submit answer...
 6. restartRun -> sees sendQuestion -> return resolved promise -> submit answer -> sees sendQuestion -> return resolved promise -> submit answer....
 */
interface InterpreterState {
    /*
     continue to run after we stopped at a break point, or after we stepped over. (the name is a bit confusing, it might be better to call it `resumeRunning`)
     basically, these are the following cases we can resume running (* means any times):
     1. restartDebug -> hit a break point -> returns the promise of first question -> (debug + hit a break point | step over)*
     -> run -> sendQuestion -> resolves promise -> (in NormalStateStart) submit answer
     2. ... -> (in DebugStateStart) submit answer -> hit a break point -> returns the promise of next question -> (debug + hit a break point | step over)*
     -> run -> sendQuestion -> resolves promise -> (in NormalStateStart) submit answer
     3. ... -> (in DebugStateStopped) submit answer -> hit a line where we can set a break point -> returns the promise of next question
     -> (debug + hit a break point | step over)* -> run -> sendQuestion -> resolves promise -> (in NormalStateStart) submit answer


     in all above cases, there are only one possibilities following a debug
     1. sendQuestion: we need to resolve the previous promise.

     this api is only intended to be used by debugger.
     */
    run: () => void;
    /*
     continue to debug after we stopped at a break point, or after we stepped over. (the name is a bit confusing, it might be better to call it `resumeDebugging`)
     basically, these are the following cases we can resume debug (* means any times):
     1. restartDebug -> hit a break point -> returns the promise of first question -> (debug + hit a break point | step over)*
     -> debug -> sendQuestion -> resolves promise -> (in DebugStateStart) submit answer
     2. ... -> (in DebugStateStart) submit answer -> hit a break point -> returns the promise of next question -> (debug + hit a break point | step over)*
     -> debug -> sendQuestion -> resolves promise -> (in DebugStateStart) submit answer
     3. ... -> (in DebugStateStopped) submit answer -> hit a line where we can set a break point -> returns the promise of next question
     -> (debug + hit a break point | step over)* -> debug -> sendQuestion -> resolves promise -> (in DebugStateStart) submit answer


     in all above cases, there are only two possibilities following a debug
     1. hit a break point: we simply stop
     2. sendQuestion: we need to resolve the previous promise.

     this api is only intended to be used by debugger.
     */
    debug: () => void;
    /*
     step over after we stopped at a break point, or after we stepped over.
     basically, these are the following cases we can resume debug (* means any times):
     1. restartDebug -> hit a break point -> returns the promise of first question -> (debug + hit a break point | step over)*
     -> step over -> sendQuestion -> resolves promise -> (in DebugStateStopped) submit answer
     2. ... -> (in DebugStateStart) submit answer -> hit a break point -> returns the promise of next question -> (debug + hit a break point | step over)*
     -> step over -> sendQuestion -> resolves promise -> (in DebugStateStopped) submit answer
     3. ... -> (in DebugStateStopped) submit answer -> hit a line where we can set a break point -> returns the promise of next question
     -> (debug + hit a break point | step over)* -> step over -> sendQuestion -> resolves promise -> (in DebugStateStopped) submit answer


     in all above cases, there are only two possibilities following a step over
     1. it stops at a line which we can set a break point. in this case it simply stops.
     2. sendQuestion: we need to resolve the previous promise.

     this api is only intended to be used by debugger.
     */
    stepOver: () => void;
    //the behavior of this api is different in different states. check its documentations in those states.
    submitAnswer: (answerData: Array<Question>) => Promise<VMResponse>;
    //start to run from the first line. returns the promise of first question (&& page && token). use this api to start a survey.
    restartRun: (token: string) => Promise<VMResponse>;
    //start to debug from the first line. returns the promise of first question when it sees the first `sendQuestion`, or when it sees a break point.
    restartDebug: (token: string) => Promise<VMResponse>;
    //eval console input
    consoleEval: (commandsStr: string, stringConstsStr: string) => void;
}

abstract class AbstractInterpreterState implements InterpreterState {

    vm: Interpreter;

    constructor(interpreter: Interpreter) {
        this.vm = interpreter;
    }

    //todo: add doc for this
    _getUnresolvedQuestionDataPromise(){
        return new Promise((resolve, reject) => {
            this.vm.toResolveNextQuestionData = resolve;
        });
    }

    //todo: and this...
    _getResolvedQuestionDataPromise(vmResponse: VMResponse){
        return Promise.resolve(vmResponse);
    }

    run() {
        if(this.vm.isWaitingForAnswer) return;
    }

    debug() {
        if(this.vm.isWaitingForAnswer) return;
    }

    stepOver() {
        if(this.vm.isWaitingForAnswer) return;
    }

    submitAnswer(answerData: Array<Question>) {
        console.log("operation not implemented!!");
        return null;
    }

    restartRun(token: string): Promise<VMResponse> {
        this.vm.state = this.vm.normalStateStart;
        return this.vm.state.restartRun(token);
    }

    restartDebug(token: string): Promise<VMResponse> {
        this.vm.state = this.vm.debugStateStart;
        return this.vm.state.restartDebug(token);
    }

    consoleEval(commandsStr: string, stringConstsStr: string) {
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
        vm.output ? vm.output(ret) : _print(ret);

        vm.callStack.getCurrentFrame().disableTempOperandStack();
        vm.callStack.getCurrentFrame().resetTempOperandStack();
        vm.commands.setIndex(preIdx);
    }


}


class NormalStateStart extends AbstractInterpreterState {

    constructor(interpreter: Interpreter) {
        super(interpreter);
    }

    _run(sendQuestionCommListener): Promise<VMResponse> {
        const vm = this.vm;
        //as long as there are commands, execute the commands
        while (vm.commands.hasNext()) {
            const comm = vm.commands.getNext();
            const ret = vm.execute(comm);
            if (ret) return sendQuestionCommListener(ret);
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
        if (vm.isWaitingForAnswer) return;
        return this._run(vm.resolvePreviousPromise.bind(vm));
    }

    /*
    (in NormalStateStart) submit answer -> send question -> return promise of next question (resolved, since we already have the question data now)
     */
    submitAnswer(answerData: Array<Question>): Promise<VMResponse> {
        if (!this.vm.isWaitingForAnswer) return;
        this.vm.mergeAnswerData(answerData);
        return this._run(this._getResolvedQuestionDataPromise.bind(this));
    }

    restartRun(token: string):Promise<VMResponse> {
        this.vm.reset();
        this.vm.token = token;
        return this._run(this._getResolvedQuestionDataPromise.bind(this));
    }


}

class DebugStateStart extends AbstractInterpreterState {

    constructor(interpreter: Interpreter) {
        super(interpreter);
    }

    _debug(breakPointListener, sendQuestionCommListener) {
        const vm = this.vm;
        while (vm.commands.hasNext()) {
            const comm = vm.commands.peekNext();
            if (vm.breakPoints.has(comm.lineNumber)) {
                vm.state = vm.debugStateStopped;
                vm.debugStateStopped.stoppedAt = comm.lineNumber;
                if(breakPointListener) {
                    return breakPointListener();
                } else {
                    return;
                }
            } else {
                vm.commands.advanceIndex();
                const ret = vm.execute(comm);
                if (ret && sendQuestionCommListener) return sendQuestionCommListener(ret);
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
        if (this.vm.isWaitingForAnswer) return;
        //when sees a break point, do nothing, when sees a sendQuestion, resolve the previous promise.
        return this._debug(null, this.vm.resolvePreviousPromise.bind(this.vm));
    }

    /*
    (In DebugStateStart) submit answer -> hit a break point -> return promise of next question  -> run / debug / step over
    (In DebugStateStart) submit answer -> sendQuestion -> return resolved promise of next question (since we already have the data of next question)
     */
    submitAnswer(answerData: Array<Question>): Promise<VMResponse> {
        if (!this.vm.isWaitingForAnswer) return;
        this.vm.mergeAnswerData(answerData);
        return this._debug(this._getUnresolvedQuestionDataPromise.bind(this), this._getResolvedQuestionDataPromise.bind(this));
    }

    restartDebug(token: string) {
        this.vm.reset();
        this.vm.token = token;
        return this._debug(this._getUnresolvedQuestionDataPromise.bind(this), this._getResolvedQuestionDataPromise.bind(this));
    }
}

class DebugStateStopped extends AbstractInterpreterState {

    stoppedAt: number;

    constructor(interpreter: Interpreter) {
        super(interpreter);
    }

    /**
     * steps over the current line.
     * @returns {Promise<void>}
     * @private
     */
    private _stepOverCurrentLine() {
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
            } else {
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
                if(breakPointListener) {
                    return breakPointListener();
                } else {
                    return;
                }
            } else {
                //we cannot set a break point here, do not stop.
                vm.commands.advanceIndex();
                const ret = vm.execute(comm);``
                if (ret) return sendQuestionCommListener(ret);
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
        if (this.vm.isWaitingForAnswer) return;
        this._stepOverCurrentLine();
        this._stopAtNextStoppableLine(null, this.vm.resolvePreviousPromise.bind(this.vm));
    }

    //when we stopped at a beak point we can choose to resume debug
    debug() {
        const vm = this.vm;
        if (vm.isWaitingForAnswer) return;
        this._stepOverCurrentLine();
        //continue to execute until it stops at another break point
        vm.state = vm.debugStateStart;
        return vm.state.debug();
    }

    run() {
        const vm = this.vm;
        if(vm.isWaitingForAnswer) return;
        this._stepOverCurrentLine();
        vm.state = vm.normalStateStart;
        return vm.state.run();
    }

    /*
    (in DebugStateStopped) submit answer -> hit a line where we can set a break point -> returns the promise of next question -> run / debug / step over
    (in DebugStateStopped) submit answer -> sendQuestion -> returns a resolved promise of next question (since we already know the question data)
     */
    submitAnswer(answerData: Array<Question>) {
        if (!this.vm.isWaitingForAnswer) return;
        this.vm.mergeAnswerData(answerData);
        return this._stopAtNextStoppableLine(this._getUnresolvedQuestionDataPromise.bind(this), this._getResolvedQuestionDataPromise.bind(this));
    }

}

export class Interpreter {
    callStack: CallStack;
    commands: Commands;
    breakPoints: Set<number>;
    debugStateStart: DebugStateStart;
    debugStateStopped: DebugStateStopped;
    normalStateStart: NormalStateStart;
    state: InterpreterState;
    stringConstants: Array<string>;
    builtInFunctions: Map<string, Function>;
    isWaitingForAnswer: boolean;
    toResolveNextQuestionData: Function;
    //todo: documentation to explain how we use token
    token: string;
    output: (content: string) => void;

    constructor(commandsStr: string, stringConstants: string, output?: (content: string) => void) {
        this.commands = new Commands(commandsStr);
        this.callStack = new CallStack();
        this.breakPoints = new Set();
        this.debugStateStart = new DebugStateStart(this);
        this.debugStateStopped = new DebugStateStopped(this);
        this.normalStateStart = new NormalStateStart(this);
        this.parseStringConstantsAndAppend(stringConstants);
        this.state = this.normalStateStart;
        this.isWaitingForAnswer = false;
        this.output = output;
        this.initBuiltInFunctions();
    }

    private initBuiltInFunctions() {
        this.builtInFunctions = new Map();
        this.builtInFunctions.set("_print", this.output ? this.output : _print);
        this.builtInFunctions.set("_getRandomNumber", _getRandomNumber);
        this.builtInFunctions.set("List", _list);
        this.builtInFunctions.set("_clock", _clock);
    }

    public parseStringConstantsAndAppend(stringConstants: string) {
        const strConsts =  stringConstants.split('\n')
        /*
             an empty string constant would at least have two " symbol because
             a string constant is always surrounded by double quotes.
             we need to filter out the empty lines because sometimes when pasting the
             the string constants string manually we accidentally introduce some empty lines.

             also...in windows, line break is \r\n, so when splitting by \n we have an extra \r at the end of each string
             we need to remove that extra \r as well.
             */
            .map(line => line.trim())
            .filter(line => line !== "")
            .map(str => {
                /*
                 remove the first and last " symbol
                 */
                return str.substring(1, str.length - 1);
            });
            if(!this.stringConstants) this.stringConstants = [];
            this.stringConstants = this.stringConstants.concat(strConsts);
    }

    private popOperandStack() {
        return this.callStack.getCurrentFrame().getOperandStack().pop();
    }

    private pushOperandStack(val: any) {
        return this.callStack.getCurrentFrame().getOperandStack().push(val);
    }

    private getFromLocalVarSpace(key: string) {
        return this.callStack.getCurrentFrame().getFromSpace(key);
    }

    private setInLocalVarSpace(key: string, val: any) {
        this.callStack.getCurrentFrame().putInSpace(key, val);
    }

    private setInGlobalVarSpace(key: string, val: any) {
        this.callStack.getGlobal().putInSpace(key, val);
    }

    private getFromGlobalVarSpace(key: string) {
        return this.callStack.global.getFromSpace(key);
    }

    private forEachParameters(func: (param: any) => void) {
        let t;
        do {
            t = this.popOperandStack();
            if (t !== PARAM_BOUND) func(t);
        } while (t !== PARAM_BOUND);
    }

    private cmpEq(comm: Command) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 === t2) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpGe(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left >= right) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpGt(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left > right) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpLe(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left <= right) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpLt(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if (left < right) this.commands.setIndexUsingStr(comm.firstOperand)
    }

    private cmpNe(comm: Command) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if (t1 !== t2) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private end() {
        this.commands.end();
        console.log("survey exits");
    }

    private goTo(comm: Command) {
        this.commands.setIndexUsingStr(comm.firstOperand);
    }

    //if equal to 0, that is, if false
    //in the very beginning we use 0 for false, and 1 for true, but now we use boolean instead
    //so this is kinda of legacy name
    private ifEq(comm: Command) {
        const t = this.popOperandStack();
        if (t === false) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    //if not equal to 0, that is, if true
    //in the very beginning we use 0 for false, and 1 for true, but now we use boolean instead
    //so this is kinda of legacy name
    private ifNe(comm: Command) {
        const t = this.popOperandStack();
        if (t === true) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private sendQuestion(): VMResponse {
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
            //todo: get the page info here.
            pageInfo: {}
        };
    }

    private newScope() {
        const parent = this.callStack.getCurrentFrame();
        const newFrame = new FuncCallFrame(parent);
        this.callStack.addFrame(newFrame);
    }

    private closeScope() {
        this.callStack.popFrame();
    }

    private defineFunc(comm: Command) {
        const funcName = comm.firstOperand;
        const startIndex = +(comm.secondOperand);
        const noOfArgs = +(comm.thirdOperand);
        const funcDef = new FuncDef(startIndex, noOfArgs);
        this.setInLocalVarSpace(funcName, funcDef);
    }

    private invokeFunc(comm: Command) {
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
        const newFrame = new FuncCallFrame(parent, returnIndex);
        //it is important that for now parent is still the call at the top of call stack because
        //`this.forEachParameters` works on the frame on top of the call stack.
        this.forEachParameters((param) => {
            //transfer the params from current frame's operand stack to the new frame's
            newFrame.getOperandStack().push(param);
        });

        const funcDef = <FuncDef>this.getFromLocalVarSpace(funcName);
        if (funcDef.noOfArgs !== newFrame.getOperandStack().length) throw new Error("wrong parameter numbers");
        this.commands.setIndex(funcDef.startIndex);
        this.callStack.addFrame(newFrame);
    }

    private invokeMethod(comm: Command) {
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

    private paramBound() {
        this.pushOperandStack(PARAM_BOUND);
    }

    private returnNull() {
        const frame = this.callStack.popFrame();
        this.pushOperandStack(undefined);
        this.commands.setIndex(frame.returnIndex);
    }

    private returnVal() {
        const ret = this.popOperandStack();
        const frame = this.callStack.popFrame();
        this.pushOperandStack(ret);
        this.commands.setIndex(frame.returnIndex);
    }

    private add() {
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

    private div() {
        this.pushOperandStack(this.popOperandStack() / this.popOperandStack());
    }

    private inc(comm: Command) {
        const incremented = this.getFromLocalVarSpace(comm.firstOperand) + 1;
        this.setInLocalVarSpace(comm.firstOperand, incremented);
    }

    private mod() {
        this.pushOperandStack(this.popOperandStack() % this.popOperandStack());
    }

    private mul() {
        this.pushOperandStack(this.popOperandStack() * this.popOperandStack());
    }

    private neg(comm: Command) {
        const neg = -this.getFromLocalVarSpace(comm.firstOperand);
        this.setInLocalVarSpace(comm.firstOperand, neg);
    }

    private sub() {
        this.pushOperandStack(this.popOperandStack() - this.popOperandStack());
    }

    private dup() {
        const t = this.popOperandStack();
        this.pushOperandStack(t);
        this.pushOperandStack(t);
    }

    private newObj() {
        this.pushOperandStack({});
    }

    private putField(comm: Command) {
        const value = this.popOperandStack();
        const obj = this.popOperandStack();
        const fieldName = comm.firstOperand;
        obj[fieldName] = value;
    }

    private readField(comm: Command) {
        const obj = this.popOperandStack();
        const value = obj[comm.firstOperand];
        this.pushOperandStack(value);
    }

    private aLoad() {
        const index = this.popOperandStack();
        const list = this.popOperandStack();
        this.pushOperandStack(list.get(index));
    }

    private empty() {
        return;
    }

    private gStore(comm: Command) {
        const name = comm.firstOperand;
        const value = this.popOperandStack();
        this.setInGlobalVarSpace(name, value);
    }

    private load(comm: Command) {
        const name = comm.firstOperand;
        this.pushOperandStack(this.getFromLocalVarSpace(name));
    }

    private pushNull() {
        this.pushOperandStack(null);
    }

    private number(comm: Command) {
        this.pushOperandStack(+(comm.firstOperand));
    }

    private store(comm: Command) {
        const name = comm.firstOperand;
        const value = this.popOperandStack();
        this.setInLocalVarSpace(name, value);
    }

    private string(comm: Command) {
        const string = this.stringConstants[+(comm.firstOperand)];
        this.pushOperandStack(string.replace('\\n', '\n'));
    }

    private boolean(comm: Command) {
        const bool = comm.firstOperand === "true";
        this.pushOperandStack(bool);
    }

    public execute(comm: Command): any {
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

    public mergeAnswerData(answerData: Array<Question>) {
        answerData.forEach(q => this.setInGlobalVarSpace(q.id, q));
        this.isWaitingForAnswer = false;
    }

    public reset(): void {
        this.isWaitingForAnswer = false;
        //if we have pending promise that needs to resolve, resolve it first...
        if (this.toResolveNextQuestionData) this.toResolveNextQuestionData(null);
        this.callStack.reset();
        this.commands.reset();
    }

    public run(): void {
        this.state.run();
    }

    public debug(): void {
        this.state.debug();
    }

    public stepOver(): void {
        this.state.stepOver();
    }

    public restartRun(token: string): Promise<VMResponse> {
        return this.state.restartRun(token);
    }

    public restartDebug(token: string): Promise<VMResponse> {
        return this.state.restartDebug(token);
    }

    public submitAnswer(answerData: Array<Question>): Promise<VMResponse> {
        return this.state.submitAnswer(answerData);
    }

    public consoleEval(commandsStr, stringConstsStr) {
        this.state.consoleEval(commandsStr, stringConstsStr);
    }

    public addBreakPoint(lineNumber: number) {
        this.breakPoints.add(lineNumber);
    }

    public deleteBreakPoint(lineNumber: number) {
        this.breakPoints.delete(lineNumber);
    }

    public resolvePreviousPromise(vmResponse: VMResponse){
        this.toResolveNextQuestionData(vmResponse);
        this.toResolveNextQuestionData = null;
    }

}

window.Interpreter = Interpreter;