/**
 * Created by sheng.wang on 2017/12/06.
 */

const prefix = "plugin_";

export const actionTypePageMounted = `${prefix}pageMounted`;
export const actionTypePageUpdated = `${prefix}pageUpdated`;
export const actionTypeQuestionChanged = `${prefix}questionChanged`;

//these event is not intended to be used by redux, rather, it is passed to plugins
export function pageUpdatedAction(pageGroupInfo, pageInfo, questions){
    return {
        type: actionTypePageUpdated,
        pageGroupInfo,
        pageInfo,
        questions
    }
}


export function pageMountedAction(){
    return {
        type: actionTypePageMounted
    }
}

export function questionChangedAction(question, questionDiv){
    return {
        question,
        questionDiv,
        type: actionTypeQuestionChanged
    }
}