(function(){
    const lowerLayerZIndex = 2;
    const higherLayerZIndex = 3;
    const videoTags = [];

    function fashion(action) {
        if(action.type === "page_pageUpdated" && action.pageInfo.id === "p1") {
            //for this demo we only support a single question..
            const question = action.questions.get(0);
            question.rowIds.forEach((rowId, index) => {
                const row = question[rowId];
                const vt =  createVideoTag(row.id, row.videoSrc);
                if(index === 0) {
                    vt.autoplay = true;
                    vt.style.zIndex = higherLayerZIndex;
                } else {
                    vt.autoplay = false;
                    vt.style.zIndex = lowerLayerZIndex;
                }
                videoTags.push(vt);
            });
            const questionPageBodyLeftDiv = document.querySelector("#question-page-body-left");
            videoTags.forEach(vt => questionPageBodyLeftDiv.appendChild(vt));
        } else if(action.type === "page_pageUpdated" && action.pageInfo.id !== "p1") {
            const fashionVideo = document.querySelector("#fashion-video");
            if(fashionVideo) fashionVideo.remove();
        } else if(action.type === "answer_setSelect") {
            const rowId = action.rowId;
            videoTags.forEach(vt => {
                vt.pause();
                vt.style.zIndex = lowerLayerZIndex;
            });
            const vt = videoTags.find(vt => vt.id === rowId);
            vt.style.zIndex = higherLayerZIndex;
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

    window.pluginManager.registerPlugins(fashion);

})();

