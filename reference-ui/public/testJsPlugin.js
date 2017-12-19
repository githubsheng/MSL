//because in react create app testing environment react js is always loaded at last
//inspect index.html and you will see...
//in real plugin we don't have such issues because real plugins are always loaded after react
//has set up.
setTimeout(function(){

    const fashionQuestionIds = new Set();

    function fashion(action) {

        switch (action.type) {
            case "plugin_questionLoad":
                questionLoad(action);
                break;
            case "plugin_questionUnLoad":
                questionUnload(action);
                break;
            case "answer_setSelect":
                answerSetSelect(action);
                break;
            default:
            //nothing
        }

        function questionLoad(action) {
            const question = action.question;
            const questionDiv = action.questionDiv;

            if(question.fashion !== "true") return;

            //only supports single choice for now.
            if(question.type !== "single-choice") return;
            const questionPageBodyLeftDiv = questionDiv.querySelector("div.rows-left");
            question.rowIds.forEach((rowId, index) => {
                const row = question[rowId];
                const vt = createVideoTag(row.id, row.videoSrc);
                if(index === 0) {
                    //auto selects the first row and plays its video...
                    //the selectRow event will trigger the video to play....
                    window.pluginManager.selectRow(question.id, rowId, null, true);
                } else {
                    vt.style.display = "none";
                }
                questionPageBodyLeftDiv.appendChild(vt)
            });

            fashionQuestionIds.add(question.id);
        }

        function questionUnload(action) {
            const question = action.question;
            const questionDiv = action.questionDiv;

            if(question.fashion !== "true") return;
            const fashionVideos = questionDiv.querySelectorAll("video.fashion-vt");
            fashionVideos.forEach(vt => vt.remove());

            fashionQuestionIds.delete(question.id);
        }

        function answerSetSelect(action){
            if(action.type === "answer_setSelect") {
                const questionId = action.questionId;
                if(!fashionQuestionIds.has(questionId)) return;

                const rowId = action.rowId;
                const questionDiv = document.getElementById(questionId);
                questionDiv.querySelectorAll("video.fashion-vt").forEach(vt => {
                    if(vt.id === rowId) {
                        vt.style.display = "block";
                        vt.play();
                    } else {
                        vt.pause();
                        vt.style.display = "none";
                    }

                });
            }
        }

        function createVideoTag(id, src) {
            const videoTag = document.createElement("video");
            videoTag.id = id;
            videoTag.src = src;
            videoTag.preload = "auto";
            videoTag.width = "400";
            videoTag.loop = true;
            videoTag.classList.add("fashion-vt");
            videoTag.autoplay = false;
            return videoTag;
        }
    }

    window.pluginManager.registerPlugins(fashion, "fashion");
}, 500);
