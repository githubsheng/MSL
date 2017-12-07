(function(){
    const videoTags = [];
    let isDisplaying = false;

    function fashion(action) {
        console.log(action);
        if(action.type === "plugin_pageChanged" && action.pageInfo.fashionPage === "true") {
            //for this demo we only support a single choice question..
            if(action.questions.size !== 1) return;
            const question = action.questions.get(0);
            if(question.type !== "single-choice") return;
            question.rowIds.forEach((rowId, index) => {
                const row = question[rowId];
                const vt =  createVideoTag(row.id, row.videoSrc);
                if(index === 0) {
                    //auto selects the first row and plays its video...
                    //the selectRow event will trigger the video to play....
                    window.pluginManager.selectRow(question.id, rowId, null, true);
                } else {
                    vt.style.display = "none";
                }
                videoTags.push(vt);
            });
            const questionPageBodyLeftDiv = document.querySelector("#question-page div.rows-left");
            videoTags.forEach(vt => questionPageBodyLeftDiv.appendChild(vt));
            isDisplaying = true;
        } else if(action.type === "plugin_pageChanged") {
            const fashionVideos = document.querySelectorAll("video.fashion-vt");
            fashionVideos.forEach(vt => vt.remove());
            isDisplaying = false;
        } else if(action.type === "answer_setSelect") {
            if(!isDisplaying) return;
            const rowId = action.rowId;
            videoTags.forEach(vt => {
                vt.pause();
                vt.style.display = "none";
            });
            const vt = videoTags.find(vt => vt.id === rowId);
            vt.style.display = "block";
            vt.play();
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

    window.pluginManager.registerPlugins(fashion, "fashion");
})();