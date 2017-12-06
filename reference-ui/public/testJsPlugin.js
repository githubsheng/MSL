//because in react create app testing environment react js is always loaded at last
//inspect index.html and you will see...
//in real plugin we don't have such issues because real plugins are always loaded after react
//has set up.
setTimeout(function(){
    const videoTags = [];
    let isDisplaying = false;

    function fashion(action) {
        if(action.type === "plugin_pageUpdated" && action.pageInfo.fashionPage === "true") {
            //for this demo we only support a single question..
            const question = action.questions.get(0);
            question.rowIds.forEach((rowId, index) => {
                const row = question[rowId];
                const vt =  createVideoTag(row.id, row.videoSrc);
                if(index === 0) {
                    //auto selects the first row and plays its video...
                    vt.autoplay = true;
                    vt.style.display = "block";
                    window.pluginManager.selectRow(question.id, rowId, null, true);
                } else {
                    vt.autoplay = false;
                    vt.style.display = "none";
                }
                videoTags.push(vt);
            });
            const questionPageBodyLeftDiv = document.querySelector("#question-page div.rows-left");
            videoTags.forEach(vt => questionPageBodyLeftDiv.appendChild(vt));
            isDisplaying = true;
        } else if(action.type === "plugin_pageUpdated") {
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
        return videoTag;
    }

    window.pluginManager.registerPlugins(fashion, "fashion");
}, 500);
