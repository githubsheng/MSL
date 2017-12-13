import {setSelectAction, submitAnswersAction, updateFormAction} from "../actions/AnswerActions";
let plugins = [];

function registerPlugins(plugin, id){
    //if the plugin is not already added...add it.
    if(plugins.findIndex(p => p.id === id) === -1) {
        plugins.push({id, plugin});
    }
}

/**
 * except for all the actions redux / react use, we would also need some other extra events
 * 1. pageReloadEvent (when new page get rendered, and all the related react components get mounted)
 * 2. ...more to come
 * @param event
 */
function passEventsToPlugins(event){
    plugins.forEach(e => {
        //e is {id, plugin}.
        e.plugin(event);
    });
}

/*
 function setSelect(questionId, rowId, colId, val) {
 dispatch(setSelectAction(questionId, rowId, colId, val));
 }

 function submitAnswersHandler() {
 dispatch(submitAnswersAction())
 }
 */

function selectRow(questionId, rowId) {
    window.referenceUIController.dispatch(setSelectAction(questionId, rowId, null, true));
}

function selectCol(questionId, rowId, colId) {
    window.referenceUIController.dispatch(setSelectAction(questionId, rowId, colId, true));
}

function updateForm(questionId, name, value) {
    window.referenceUIController.dispatch(updateFormAction(questionId, name, value));
}

function unselectRow(questionId, rowId) {
    window.referenceUIController.dispatch(setSelectAction(questionId, rowId, null, false));
}

function unselectCol(questionId, rowId, colId) {
    window.referenceUIController.dispatch(setSelectAction(questionId, rowId, colId, false));
}

function accessPageVariable(name) {
    /** @namespace window.interpreter.getFromLocalVarSpace */
    return window.interpreter.getFromLocalVarSpace(name);
}

function submitAnswer(){
    window.referenceUIController.dispatch(submitAnswersAction())
}

function resetRegisteredPlugins(){
    plugins = [];
}

export const pluginManager = {
    registerPlugins,
    passEventsToPlugins,
    selectRow,
    selectCol,
    updateForm,
    unselectRow,
    unselectCol,
    accessPageVariable,
    submitAnswer,
    resetRegisteredPlugins
};

window.pluginManager = pluginManager;