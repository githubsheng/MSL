let editor;
let consoleDiv;
let consoleOutputDiv;
let referenceUiDiv;
let previewInstructionDiv;

function init(){
    editor = ace.edit("editor");
    //ace editor says, if we don't set this there will be warnings. anyway, just set it.
    editor.$blockScrolling = Infinity;
    editor.setHighlightActiveLine(false);
    editor.getSession().setMode("ace/mode/msl");
    editor.setOptions({
        fontSize: "14px"
    });

    consoleDiv = document.querySelector("#console");
    consoleOutputDiv = document.querySelector("#console-output");
    referenceUiDiv = document.querySelector("#reference-ui");
    previewInstructionDiv = document.querySelector("#preview-introduction");

    tryCompileOnChanges();
    listenerForBreakpointsSettings();
    bindReRunSurveyButton();
    bindReDebugButton();
    bindResumeDebugBtn();
    bindStepOverBtn();
    bindConsoleInput();
    bindClearConsoleBtn();
    bindResizeBtn();
    bindSingleChoiceMacro();
    bindPageMacro();
    bindMultipleChoiceMacro();
    bindSingleMatrixMacro();
    bindMultipleMatrixMacro();
    bindPageGroupMacro();
}