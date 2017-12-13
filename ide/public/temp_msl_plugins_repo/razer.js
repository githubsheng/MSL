(function () {

    function razer(action) {

        switch (action.type) {
            case "plugin_questionLoad":
                questionLoad(action);
                break;
            case "plugin_questionUnLoad":
                questionUnload(action);
                break;
            default:
            //nothing
        }

        function questionLoad(action) {
            const question = action.question;
            if(question.razer !== "true") return;
            //mount the razer iframe....
            const iframeElem = document.createElement("iframe");
            iframeElem.height = "528";
            iframeElem.scrolling = "no";
            iframeElem.src = "//assets.razerzone.com/animation/ouroboros_v2/index.html";
            iframeElem.width = "938";
            iframeElem.classList.add("razer-iframe");

            const belowQuestionTextDiv = action.questionDiv.querySelector(".below-question-text");
            belowQuestionTextDiv.appendChild(iframeElem);
        }

        function questionUnload(action) {
            const question = action.question;
            if(question.razer !== "true") return;
            const iframe = action.questionDiv.querySelector(`.below-question-text .razer-iframe`);
            if (iframe) iframe.remove();
        }
    }

    window.pluginManager.registerPlugins(razer, "razer");
})();