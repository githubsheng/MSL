import {Interpreter} from "../src/interpreter.js";

let interpreter;

function init(){
    const commandsStr = (<HTMLTextAreaElement>document.querySelector("#commands")).value;
    const stringConstStr = (<HTMLTextAreaElement>document.querySelector("#string-constants")).value;
    interpreter = new Interpreter(commandsStr, stringConstStr, sendFunc);
    window.interpreter = interpreter;
}

function sendFunc(data, returnAnswerCallback) {
    // console.log(data);
    returnAnswerCallback(null);
}

function run(){
    interpreter.run();
}

function debug(){
    interpreter.debug();
}

function stepOver(){
    interpreter.stepOver();
}

function displayBreakPoints(){
    const breakPointsDiv = document.querySelector("#break-points");
    while(breakPointsDiv.lastChild)
        breakPointsDiv.removeChild(breakPointsDiv.lastChild);
    for (let b of interpreter.breakPoints) {
        const el = document.createElement("div");
        el.innerText = b;
        breakPointsDiv.appendChild(el);
    }
}

function addBreakPoints(){
    const input = <HTMLInputElement>document.querySelector("#add-break-points");
    const lineNumber = input.value;
    interpreter.addBreakPoint(+(lineNumber));
    input.value = "";
    displayBreakPoints();
}

function deleteBreakPoints(){
    const input = <HTMLInputElement>document.querySelector("#remove-break-points");
    const lineNumber = input.value;
    interpreter.deleteBreakPoint(+(lineNumber));
    input.value = "";
    displayBreakPoints();
}

window.init = init;
window.run = run;
window.debug = debug;
window.stepOver = stepOver;
window.displayBreakPoints = displayBreakPoints;
window.addBreakPoints = addBreakPoints;
window.deleteBreakPoints = deleteBreakPoints;



