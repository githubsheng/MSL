let editor;
let consoleDiv;
let consoleOutputDiv;

function init(){
    editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;

    consoleDiv = document.querySelector("#console");
    consoleOutputDiv = document.querySelector("#console-output");

    tryCompileOnChanges();
    listenerForBreakpointsSettings();
    bindReRunSurveyButton();
    bindReDebugButton();
    bindResumeDebugBtn();
    bindStepOverBtn();
    bindConsoleInput();
}