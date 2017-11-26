function showCompileResult(messages){
    const compileMessageDiv = document.querySelector("#compile-message");
    while(compileMessageDiv.lastChild) compileMessageDiv.removeChild(compileMessageDiv.lastChild);
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

const breakPoints = new Set();

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



