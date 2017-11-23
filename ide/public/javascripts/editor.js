const breakPoints = new Set();

let editor;

function init(){
    editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;

    tryCompileOnChanges();
    listenerForBreakpointsSettings();
    bindReRunSurveyButton();
}

function showCompileResult(messages){
    const compileMessageDiv = document.querySelector("#compile-message");

    while(compileMessageDiv.lastChild) compileMessageDiv.removeChild(compileMessageDiv.lastChild);
    console.log(messages);
    const frag = document.createDocumentFragment();
    messages.forEach(function(msg){
        frag.appendChild(document.createTextNode(msg));
        frag.appendChild(document.createElement("br"));
    });
    compileMessageDiv.appendChild(frag);
}

function tryCompileOnChanges(){
    let editorContentChangeTracker = 0;
    let compiledTracker = 0;

    editor.getSession().on('change', function() {
        editorContentChangeTracker++;
    });

    setInterval(tryCompile, 1000);

    function tryCompile() {
        if(editorContentChangeTracker !== compiledTracker) {
            compiledTracker = editorContentChangeTracker;
            const src = editor.getValue();
            const dataSend = {data: src};
            $.post("/compiler/compile", dataSend, function(res){
                res.errMsg ? showCompileResult(res.errMsg) : showCompileResult([]);
            });
        }
    }
}


function listenerForBreakpointsSettings(){
    const $editorDiv = $("#editor");
    $editorDiv.on("click", "div.ace_gutter-cell", function(evt){
        const $target = $(evt.target);
        const lineNumber = +($target.text());
        if(breakPoints.has(lineNumber)) {
            breakPoints.delete(lineNumber);
            $target.removeClass("breakPoint");
        } else {
            breakPoints.add(lineNumber);
            $target.addClass("breakPoint");
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
        if(res.errMsg) showCompileResult(res.errMsg);
        //`commsStrs` and `strsConsts`
        window.interpreter = new Interpreter(res.commsStrs, res.strsConsts);
        // window.interpreter.restartRun().then(vmResponse => console.log(vmResponse));
        referenceUIController.rerunSurvey();
    });
}

