function appendInputContentToConsoleOutput(content) {
    const block = document.createElement("div");
    const t = content.split('\n');
    const s = t.length - 1;
    t.forEach((line, index) => {
        block.appendChild(document.createTextNode(line));
        if(index !== s)
            block.appendChild(document.createElement("br"));
    });
    block.className = "input-lines";
    consoleOutputDiv.appendChild(block);
}

//consoleOutputDiv and consoleDiv is initialized in main.js
function appendResultToConsoleOutput(content){
    const block = document.createElement("div");
    block.appendChild(document.createTextNode(content));
    block.className = "output-lines";
    if(content === undefined) block.classList.add("undefined");
    consoleOutputDiv.appendChild(block);

    //all the following code is used to shift the input box upwards
    //when it goes out of view.
    const downShift = consoleOutputDiv.getBoundingClientRect().height;
    const upShift = consoleDiv.scrollTop;
    const containerHeight = consoleDiv.getBoundingClientRect().height;
    //containerHeight - (downShift - upShift) = 20;
    //containerHeight - downShift + upShift = 20;
    //upShift = 20 - containerHeight + downShift;
    if(downShift - upShift > containerHeight - 30) {
        consoleDiv.scrollTop = 30 - containerHeight + downShift;
    }
}

function evaluateExpression(content){
    if(!window.interpreter) {
        window.interpreter = new Interpreter("", "", appendResultToConsoleOutput);
    }

    const vm = window.interpreter;
    const commandIndexOffset = vm.commands.commArray.length;
    const strConstsIndexOffset = vm.stringConstants.length;

    //add the temp flag to signal the parser we are parsing an console input
    //here, make sure content ends with an eos (because in compiler, most statements expects an eos in the end); append an eos if necessary.
    const src = "###temp " + content + "\n";
    const dataSend = {
        data: src,
        commandIndexOffset,
        strConstsIndexOffset
    };

    $.post("/compiler/exec", dataSend, function(res){
        if(res.errMsg) {
            showCompileResult(res.errMsg, false);
            return;
        } else {
            showCompileResult(["compilation success"], true);
        }
        //`res.commsStrs` and `res.strsConsts`

        vm.consoleEval(res.commsStrs, res.strsConsts);
    });
}

function bindConsoleInput(){
    const consoleInputTextarea = document.querySelector("#console-input");
    consoleInputTextarea.addEventListener('keydown', function(e) {
        if(e.keyCode == 13 && e.ctrlKey) {
            evaluateExpression(consoleInputTextarea.value);
            appendInputContentToConsoleOutput(consoleInputTextarea.value);
            consoleInputTextarea.value = "";
        }
    });

}

function bindReRunSurveyButton(){
    const reRunBtn = document.querySelector("#re-run-btn");
    reRunBtn.onclick = reRunSurvey;
}

function reRunSurvey(){
    const src = editor.getValue();
    const dataSend = {data: src};
    $.post("/compiler/exec", dataSend, function(res){
        if(res.errMsg) {
            showCompileResult(res.errMsg, false);
        } else {
            showCompileResult(["compilation successful"], true);
            clearConsoleOutput();
            clearStoppedLines();
            referenceUiDiv.style.display = "block";
            previewInstructionDiv.style.display = "none";
            //`commsStrs` and `strsConsts`
            window.interpreter = new Interpreter(res.commsStrs, res.strsConsts, appendResultToConsoleOutput, stoppedAtLine);
            // window.interpreter.restartRun().then(vmResponse => console.log(vmResponse));
            referenceUIController.reRunSurvey(res.jsPluginImports, res.cssPluginImports);
        }


    });
}

function bindReDebugButton(){
    const reDebugBtn = document.querySelector("#re-debug-btn");
    reDebugBtn.onclick = reDebugSurvey;
}

function reDebugSurvey(){
    const src = editor.getValue();
    const dataSend = {data: src};
    $.post("/compiler/exec", dataSend, function(res){
        if(res.errMsg) {
            showCompileResult(res.errMsg);
        } else {
            showCompileResult(["compilation successful"], true);
            clearConsoleOutput();
            clearStoppedLines();
            referenceUiDiv.style.display = "block";
            previewInstructionDiv.style.display = "none";
            //`commsStrs` and `strsConsts`
            window.interpreter = new Interpreter(res.commsStrs, res.strsConsts, appendResultToConsoleOutput, stoppedAtLine);
            const interpreter = window.interpreter;
            breakPoints.forEach(lineNumber => interpreter.addBreakPoint(lineNumber));
            referenceUIController.reDebugSurvey(res.jsPluginImports, res.cssPluginImports);
        }
    });
}

function bindResumeDebugBtn(){
    const resumeDebugBtn = document.querySelector("#resume-debug-btn");
    resumeDebugBtn.onclick = resumeDebugging;
}

function resumeDebugging(){
    const interpreter = window.interpreter;
    if(!interpreter) return;
    clearStoppedLines();
    interpreter.debug();
}

function bindStepOverBtn(){
    const stepOverBtn = document.querySelector("#step-over-btn");
    stepOverBtn.onclick = stepOver;
}

function stepOver(){
    const interpreter = window.interpreter;
    if(!interpreter) return;
    clearStoppedLines();
    interpreter.stepOver();
}

const {stoppedAtLine, clearStoppedLines} = (function(){

    let stoppedRow = 0;

    function stoppedAtLine(lineNumber){
        const row = lineNumber - 1;
        editor.session.addGutterDecoration(row, "stopped");
        stoppedRow = row;
    }

    function clearStoppedLines() {
        editor.session.removeGutterDecoration(stoppedRow, "stopped");
    }

    return {
        stoppedAtLine,
        clearStoppedLines
    };
})();

function clearConsoleOutput(){
    while(consoleOutputDiv.lastChild)
        consoleOutputDiv.removeChild(consoleOutputDiv.lastChild);
}

function bindClearConsoleBtn(){
    document.querySelector("#clear-console").onclick = clearConsoleOutput;
}

const resize = (function(){
    //0 normal, 1 small
    let size = 0;

    function resize(){
        switch(size) {
            case 0:
                consoleDiv.style.height = "100px";
                referenceUiDiv.style.bottom = "110px";
                size = 1;
                break;
            case 1:
                consoleDiv.style.height = "230px";
                referenceUiDiv.style.bottom = "240px";
                size = 0;
                break;
            default:
            //nothing.
        }
    }

    return resize;
})();

function bindResizeBtn(){
    document.querySelector("#resize-console").onclick = resize;
}
