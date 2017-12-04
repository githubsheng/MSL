/**
 * Created by wangsheng on 4/12/17.
 */
setTimeout(function(){
    //because in react create app testing environment react js is always loaded at last
    //inspect index.html and you will see...
    //in real plugin we don't have such issues because real plugins are always loaded after react
    //has set up.

    let changed = false;

    function echo(action) {
        console.log(action);

        if(action.type === "page_pageUpdated") {
            if(changed) return;
            const questionPageBannerDiv = document.querySelector("div.question-page > div.banner");
            questionPageBannerDiv.style.background = "red";
            changed = true;
        }
    }

    window.pluginManager.registerPlugins(echo);
}, 500);
