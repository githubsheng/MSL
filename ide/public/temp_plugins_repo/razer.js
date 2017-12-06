(function(){

    function razer(action) {
        console.log(action);
        // if(action.type === "page_pageUpdated") {
        //     action.questions.forEach(question => {
        //         if(question.razer === "true") {
        //             //mount the razer iframe....
        //             const iframeElem = document.createElement("iframe");
        //             iframeElem.height = "528";
        //             iframeElem.scrolling = "no";
        //             iframeElem.src = "//assets.razerzone.com/animation/ouroboros_v2/index.html";
        //             iframeElem.width = "938";
        //             iframeElem.classList.add("razer-iframe");
        //
        //             const belowQuestionTextDiv = document.querySelector(`#${question.id} .below-question-text`);
        //             belowQuestionTextDiv.appendChild(iframeElem);
        //         } else {
        //             const iframe= document.querySelector(`#${question.id} .below-question-text .razer-iframe`);
        //             if(iframe) iframe.remove();
        //         }
        //     });
        // }
    }

    window.pluginManager.registerPlugins(razer, "razer");
})();