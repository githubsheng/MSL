import {Interpreter} from "../src/interpreter";
import {Question} from "../src/questionTypes";

let interpreter: Interpreter;
let page: HTMLDivElement;
let submitBtn: HTMLButtonElement;
let answers: HTMLTextAreaElement;

function init(){
    const commandsStr = (<HTMLTextAreaElement>document.querySelector("#commands")).value;
    const stringConstStr = (<HTMLTextAreaElement>document.querySelector("#string-constants")).value;
    interpreter = new Interpreter(commandsStr, stringConstStr);
    window.interpreter = interpreter;
    page = <HTMLDivElement>document.querySelector("#page");
    answers = <HTMLTextAreaElement>document.querySelector("#answers");
    submitBtn = <HTMLButtonElement>document.querySelector("#submitAnswer");
    submitBtn.onclick = submitAnswer;
}

function displayQuestion(questionData: Array<Question>) {
    const c = JSON.stringify(questionData, undefined, 4);
    page.innerHTML = syntaxHighlight(c);
    submitBtn.disabled = false;
}

function submitAnswer(){
    //todo: get the answer data in the text area..... and make it a json.
    submitBtn.disabled = true;
    const t = JSON.parse(answers.value);
    const p = interpreter.submitAnswer(t);
    p.then(displayQuestion);
}

function run(){
    //reset ui
    while(page.lastChild) page.removeChild(page.lastChild);
    const p = interpreter.restartRun();
    submitBtn.disabled = true;
    p.then(displayQuestion);
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
        el.innerText = `${b}`;
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

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

window.init = init;
window.run = run;
window.debug = debug;
window.stepOver = stepOver;
window.displayBreakPoints = displayBreakPoints;
window.addBreakPoints = addBreakPoints;
window.deleteBreakPoints = deleteBreakPoints;



