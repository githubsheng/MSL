let editor;
let consoleOutputDiv;

function init(){
    editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;

    consoleOutputDiv = document.querySelector("#console-output");

    tryCompileOnChanges();
    listenerForBreakpointsSettings();
    bindReRunSurveyButton();
    bindReDebugButton();
    bindResumeDebugBtn();
    bindStepOverBtn();
    bindConsoleInput();
}