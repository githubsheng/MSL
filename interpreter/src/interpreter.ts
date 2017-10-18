import {Commands, Command} from "./commands.js";
import {CallStack, FuncCallFrame, FuncDef} from "./callstack.js";
import {List, _print, _list, _clock} from "./builtIn.js";
const PARAM_BOUND = {specialCommandName: "param_bound"};

interface InterpreterState {
    //run the script from start to end
    run: () => void;
    //run the script and stop at a break point. when stopped, call this method to run until it stops at another break point.
    debug: () => void;
    //steps over the current line and then stop.
    stepOver: () => void;
    //start to debug from the first line.
    restartDebug: () => void;
    //eval console input
    consoleEval: (commandsStr: string) => void;
}

abstract class AbstractInterpreterState implements InterpreterState {

    async run() {
        console.log("operation not supported under such state");
    }

    async debug() {
        console.log("operation not supported under such state");
    }

    async stepOver() {
        console.log("operation not supported under such state");
    }

    async restartDebug() {
        console.log("operation not supported under such state");
    }

    async consoleEval(commandsStr: string) {
        console.log("operation not supported under such state");
    }
}

class NormalStateStart extends AbstractInterpreterState {

    vm: Interpreter;

    constructor(interpreter: Interpreter) {
        super();
        this.vm = interpreter;
    }

    async run() {
        const vm = this.vm;
        //as long as there are commands, execute the commands
        while (vm.commands.hasNext()) {
            const comm = vm.commands.getNext();
            await vm.execute(comm);
        }
        //just so after we are done running the program user can run again.
        vm.reset();
    }

    async debug() {
        const vm = this.vm;
        vm.state = vm.debugStateStart;
        await vm.state.debug();
    }

    async restartDebug() {
        await this.debug();
    }
}

class DebugStateStart extends AbstractInterpreterState {

    vm: Interpreter;

    constructor(interpreter: Interpreter) {
        super();
        this.vm = interpreter;
    }

    async debug() {
        const vm = this.vm;
        while (vm.commands.hasNext()) {
            const comm = vm.commands.peekNext();
            if (vm.breakPoints.has(comm.lineNumber)) {
                vm.state = vm.debugStateStopped;
                vm.debugStateStopped.stoppedAt = comm.lineNumber;
                return;
            } else {
                vm.commands.advanceIndex();
                await vm.execute(comm);
            }
        }
        //just so after we are done running the entire program in debug mode user can run again.
        vm.state = vm.normalStateStart;
        vm.reset();
    }
}

class DebugStateStopped extends AbstractInterpreterState {

    vm: Interpreter;
    stoppedAt: number;

    constructor(interpreter: Interpreter) {
        super();
        this.vm = interpreter;
    }

    /**
     * steps over the current line.
     * @returns {Promise<void>}
     * @private
     */
    private async _stepOver() {
        const vm = this.vm;
        const stoppedAt = this.stoppedAt;
        while(vm.commands.hasNext()) {
            const comm = vm.commands.peekNext();
            if(comm.lineNumber === stoppedAt) {
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
                await vm.execute(comm);
            } else {
                /*
                 we have stepped over the current break point.
                 */
                return;
            }
        }
    }

    /**
     * steps over the current line and continue to execute until it reaches another line that we can set a break point.
     * @returns {Promise<void>}
     */
    async stepOver(){
        const vm = this.vm;
        await this._stepOver();
        while(vm.commands.hasNext()) {
            const comm = vm.commands.peekNext();
            if(comm.lineNumber >= 0) {
                //this is a line where we can set a break point, stop at this line (do not execute this line)
                this.stoppedAt = comm.lineNumber;
                return;
            } else {
                //we cannot set a break point here, do not stop.
                vm.commands.advanceIndex();
                await vm.execute(comm);
            }
        }
        //if we are here then it means we cannot find any line to stop. we have gone all the way to the end of the program.
        vm.reset();
    }

    async debug() {
        await this._stepOver();
        //continue to execute until it stops at another break point
        this.vm.state = this.vm.debugStateStart;
        await this.vm.state.debug();
    }

    async run() {
        this.vm.state = this.vm.normalStateStart;
        await this.vm.normalStateStart.run();
    }

    async restartDebug() {
        this.vm.reset();
        this.vm.state = this.vm.debugStateStart;
        await this.vm.state.debug();
    }

    async consoleEval(commandsStr: string){
        const vm = this.vm;
        vm.commands.parseCommandsAndAppend(commandsStr);
        const preIdx = vm.commands.getNextCommandIndex();
        vm.commands.advanceIndexForNewCommands();
        vm.callStack.getCurrentFrame().enableTempOperandStack();
        await this.run();
        vm.callStack.getCurrentFrame().disableTempOperandStack();
        vm.state = this;
        vm.commands.setIndex(preIdx);
    }
}

interface SendFunc {
    (data: any, returnAnswerCallback: (returnedAnswer: any) => void) : void;
}

export class Interpreter {
    callStack: CallStack;
    commands: Commands;
    breakPoints: Set<number>;
    debugStateStart: DebugStateStart;
    debugStateStopped: DebugStateStopped;
    normalStateStart: NormalStateStart;
    state: InterpreterState;
    sendFunc: SendFunc;
    stringConstants: Array<string>;
    builtInFunctions: Map<string, Function>;

    constructor(commandsStr: string, stringConstants: string, sendFunc: SendFunc) {
        this.commands = new Commands(commandsStr);
        this.callStack = new CallStack();
        this.breakPoints = new Set();
        this.debugStateStart = new DebugStateStart(this);
        this.debugStateStopped = new DebugStateStopped(this);
        this.normalStateStart = new NormalStateStart(this);
        this.stringConstants = this.parseStringConstants(stringConstants);
        this.state = this.normalStateStart;
        this.sendFunc = sendFunc;
        this.initBuiltInFunctions();
    }

    private initBuiltInFunctions(){
        this.builtInFunctions = new Map();

        this.builtInFunctions.set("_print", _print);
        this.builtInFunctions.set("_getRandomNumber", _print);
        this.builtInFunctions.set("List", _list);
        this.builtInFunctions.set("_clock", _clock);
    }

    private parseStringConstants(stringConstants: string) {
        return stringConstants.split('\n')
            /*
                an empty string constant would at least have two " symbol because
                a string constant is always surrounded by double quotes.
                we need to filter out the empty lines because sometimes when pasting the
                the string constants string manually we accidentally introduce some empty lines.
             */
            .filter(line => line.trim() !== "")
            .map(str => {
                //remove the first and last " symbol
                return str.substring(1, str.length - 1);
            })
    }

    private popOperandStack() {
        return this.callStack.getCurrentFrame().getOperandStack().pop();
    }

    private pushOperandStack(val: any) {
        return this.callStack.getCurrentFrame().getOperandStack().push(val);
    }

    private getFromLocalVarSpace(key: string){
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
            if( t !== PARAM_BOUND) func(t);
        } while (t !== PARAM_BOUND);
    }

    private cmpEq(comm: Command){
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if(t1 === t2) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpGe(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if(left >= right) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpGt(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if(left > right) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpLe(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if(left <= right) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private cmpLt(comm: Command) {
        const right = this.popOperandStack();
        const left = this.popOperandStack();
        if(left < right) this.commands.setIndexUsingStr(comm.firstOperand)
    }

    private cmpNe(comm: Command) {
        const t1 = this.popOperandStack();
        const t2 = this.popOperandStack();
        if(t1 !== t2) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private end() {
        this.commands.end();
        console.log("survey exits");
    }

    private goTo(comm: Command) {
         this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private ifEq(comm: Command) {
        const t = this.popOperandStack();
        if(t === 0) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private ifNe(comm: Command) {
        const t = this.popOperandStack();
        if(t !== 0) this.commands.setIndexUsingStr(comm.firstOperand);
    }

    private mergeAnswerData(answerData: any){
        //todo:
    }

    private async sendQuestion() {
        const questionData = [];
        this.forEachParameters((param) => {
            //here params being question references..
            questionData.push(param);
        });
        const sendFunc = this.sendFunc.bind(this);
        const answerData = await new Promise(function(resolve, reject) {
            sendFunc(questionData, returnAnswerCallback);
            function returnAnswerCallback(answerData: any) {
                resolve(answerData);
            }
        });
        this.mergeAnswerData(answerData);
    }

    private newScope(){
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
        if(this.builtInFunctions.has(funcName)) {
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
        if(funcDef.noOfArgs !== newFrame.getOperandStack().length) throw new Error("wrong parameter numbers");
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

    private returnVal(){
        const ret = this.popOperandStack();
        const frame = this.callStack.popFrame();
        this.pushOperandStack(ret);
        this.commands.setIndex(frame.returnIndex);
    }

    private add(){
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

    private div(){
        this.pushOperandStack(this.popOperandStack() / this.popOperandStack());
    }

    private inc(comm: Command){
        const incremented = this.getFromLocalVarSpace(comm.firstOperand) + 1;
        this.setInLocalVarSpace(comm.firstOperand, incremented);
    }

    private mod() {
        this.pushOperandStack(this.popOperandStack() % this.popOperandStack());
    }

    private mul(){
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

    private newObj(){
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

    private empty(){
        return;
    }

    private gStore(comm: Command){
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

    async execute(comm: Command) {
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

    }

    reset(){
        this.callStack.reset();
        this.commands.reset();
    }

    async run() {
        await this.state.run();
    }

    async debug() {
        await this.state.debug();
    }

    async restartDebug() {
        await this.state.restartDebug();
    }

    async stepOver(){
        await this.state.stepOver();
    }

    async consoleEval(commandsStr) {
        await this.state.consoleEval(commandsStr);
    }

    addBreakPoint(lineNumber: number) {
        this.breakPoints.add(lineNumber);
    }

    deleteBreakPoint(lineNumber: number) {
        this.breakPoints.delete(lineNumber);
    }

}