/**
 * Created by sheng.wang on 2017/12/04.
 */

const plugins = [];

//todo: function to register a call back, we call the callback when certain events happens
function registerPlugins(plugin){
    plugins.push(plugin);
}

/**
 * except for all the actions redux / react use, we would also need some other extra events
 * 1. pageReloadEvent (when new page get rendered, and all the related react components get mounted)
 * 2. ...more to come
 * @param event
 */
function passEventsToPlugins(event){
    plugins.forEach(plugin => {
        plugin(event);
    });
}

function selectRow(questionId, rowId) {

}

function selectCol(questionId, rowId, colId) {

}

function updateForm(questionId, elemName, value) {

}

function unselectRow(questionId, rowId) {

}

function unselectCol(questionId, rowId, colId) {

}

function updateDuration(questionId, timeInMilliseconds) {

}

function updateTotalClicks(questionId, totalClicks) {

}

function accessPageVariable(name) {

}

function submitAnswer(){

}

export const pluginManager = {
    registerPlugins,
    passEventsToPlugins,
    selectRow,
    selectCol,
    updateForm,
    unselectRow,
    unselectCol,
    updateDuration,
    updateTotalClicks,
    accessPageVariable,
    submitAnswer
};



//todo: functions to manipulate answers....