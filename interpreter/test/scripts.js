let interpreter;

function init(){
    const commandsStr = document.querySelector("#commands").value;
    const stringConstStr = document.querySelector("#string-constants").value;
    interpreter = new Interpreter(commandsStr, stringConstStr, sendFunc);
}

function sendFunc(data, returnAnswerCallback) {
    console.log(data);
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
    const input = document.querySelector("#add-break-points");
    const lineNumber = input.value;
    interpreter.addBreakPoint(+(lineNumber));
    input.value = "";
    displayBreakPoints();
}

function deleteBreakPoints(){
    const input = document.querySelector("#remove-break-points");
    const lineNumber = input.value;
    interpreter.deleteBreakPoint(+(lineNumber));
    input.value = "";
    displayBreakPoints();
}