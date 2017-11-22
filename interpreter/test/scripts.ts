import {Interpreter} from "../src/interpreter";
import {Question, VMResponse} from "../src/questionTypes";

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

function displayQuestion(vmResponse: VMResponse) {
    const c = JSON.stringify(vmResponse.questions, undefined, 4);
    page.innerHTML = syntaxHighlight(c);
    submitBtn.disabled = false;
}

function submitAnswer(){
    submitBtn.disabled = true;
    const t = JSON.parse(answers.value);
    const p = interpreter.submitAnswer(t);
    p.then(displayQuestion);
}

function resetPageUI(){
    while(page.lastChild) page.removeChild(page.lastChild);
}

function restartRun(){
    resetPageUI();
    const token = Date.now().toString();
    const p = interpreter.restartRun(token);
    submitBtn.disabled = true;
    p.then(displayQuestion);
}

function restartDebug(){
    resetPageUI();
    const token = Date.now().toString();
    const p = interpreter.restartDebug(token);
    submitBtn.disabled = true;
    p.then(displayQuestion);
}

function resumeRun(){
    interpreter.run();
}

function resumeDebug(){
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
window.restartRun = restartRun;
window.restartDebug = restartDebug;
window.resumeDebug = resumeDebug;
window.resumeRun = resumeRun;
window.stepOver = stepOver;
window.displayBreakPoints = displayBreakPoints;
window.addBreakPoints = addBreakPoints;
window.deleteBreakPoints = deleteBreakPoints;



