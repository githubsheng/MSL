const breakPoints = new Set();

function init(){
    const compileMessageDiv = document.querySelector("#compile-message");

    const editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;

    tryCompileOnChanges();
    listenerForBreakpointsSettings();

    function tryCompileOnChanges(){
        let editorContentChangeTracker = 0;
        let compiledTracker = 0;
        editor.getSession().on('change', function() {
            editorContentChangeTracker++;
        });

        setInterval(tryCompile, 1000);

        function showCompileResult(messages){
            while(compileMessageDiv.lastChild) compileMessageDiv.removeChild(compileMessageDiv.lastChild);
            console.log(messages);
            const frag = document.createDocumentFragment();
            messages.forEach(function(msg){
                frag.appendChild(document.createTextNode(msg));
                frag.appendChild(document.createElement("br"));
            });
            compileMessageDiv.appendChild(frag);
        }

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
}


