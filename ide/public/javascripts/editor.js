function showCompileResult(messages, isSuccessful){
    const compileMessageDiv = document.querySelector("#compile-message");
    while(compileMessageDiv.lastChild) compileMessageDiv.removeChild(compileMessageDiv.lastChild);
    const frag = document.createDocumentFragment();
    messages.forEach(function(msg){
        frag.appendChild(document.createTextNode(msg));
        frag.appendChild(document.createElement("br"));
    });
    compileMessageDiv.className = isSuccessful ? "success" : "error";
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
                res.errMsg ? showCompileResult(res.errMsg, false) : showCompileResult(["compilation success"], true);
            });
        }
    }
}

const breakPoints = new Set();

function listenerForBreakpointsSettings(){
    editor.on("guttermousedown", function(e) {
        const target = e.domEvent.target;
        if (target.className.indexOf("ace_gutter-cell") == -1)
            return;
        if (!editor.isFocused())
            return;

        //notice that the row number is not the line number, row number starts at 0, so,
        //line number = row number + 1.
        const row = e.getDocumentPosition().row;
        const lineNumber = row + 1;

        if(breakPoints.has(lineNumber)) {
            breakPoints.delete(lineNumber);
            if(window.interpreter) window.interpreter.deleteBreakPoint(lineNumber);
            e.editor.session.clearBreakpoint(row);
        } else {
            breakPoints.add(lineNumber);
            if(window.interpreter) window.interpreter.addBreakPoint(lineNumber);
            e.editor.session.setBreakpoint(row);
        }
        e.stop();
    })
}



