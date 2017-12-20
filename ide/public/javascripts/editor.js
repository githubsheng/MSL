function showCompileResult(messages, isSuccessful){
    const compileMessageDiv = document.querySelector("#compile-message");
    while(compileMessageDiv.lastChild) compileMessageDiv.removeChild(compileMessageDiv.lastChild);
    const frag = document.createDocumentFragment();
    messages.forEach(function(msg){
        frag.appendChild(document.createTextNode(msg));
        frag.appendChild(document.createElement("br"));
    });
    compileMessageDiv.className = isSuccessful ? "success container-box-shadow" : "error container-box-shadow";
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
                res.errMsg ? showCompileResult(res.errMsg, false) : showCompileResult(["no syntax error :)"], true);
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

function generateRowsTemplate(){
    let str = "";
    for(let i = 0; i < 10; i++) {
        str += `\n[Row id="r${i+1}"]`;
    }
    return str;
}

function generateColsTemplate(){
    let str = "";
    for(let i = 0; i < 10; i++) {
        str += `\n[Col id="c${i+1}"]`;
    }
    return str;
}

function bindPageGroupMacro(){
    document.querySelector("#page-group-macro").onclick = function(){
        editor.insert("[PageGroup]\n[Page]\n\n[Submit]\n[PageEnd]\n[PageGroupEnd]");
    };
}

function bindPageMacro(){
    document.querySelector("#page-macro").onclick = function(){
        editor.insert("[Page]\n\n[Submit]\n[PageEnd]");
    };
}

function bindSingleChoiceMacro(){
    document.querySelector("#sc-macro").onclick = function(){
        editor.insert("[SingleChoice id=\"qId\"]" + generateRowsTemplate());
    };
}

function bindMultipleChoiceMacro(){
    document.querySelector("#mc-macro").onclick = function(){
        editor.insert("[MultipleChoice id=\"qId\"]" + generateRowsTemplate());
    };
}

function bindSingleMatrixMacro(){
    document.querySelector("#sm-macro").onclick = function(){
        editor.insert("[SingleMatrix id=\"qId\"]" + generateRowsTemplate() + generateColsTemplate());
    };
}

function bindMultipleMatrixMacro(){
    document.querySelector("#mm-macro").onclick = function(){
        editor.insert("[MultipleMatrix id=\"qId\"]" + generateRowsTemplate() + generateColsTemplate());
    };
}

function bindEmptyPageMacro(){
    document.querySelector("#empty-page-macro").onclick = function(){
        editor.insert("[EmptyPage]\n\n[EmptyPageEnd]");
    }
}

