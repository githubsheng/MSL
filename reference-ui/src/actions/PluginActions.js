/**
 * Created by sheng.wang on 2017/12/06.
 */

const prefix = "plugin_";

export const actionTypePageLoad = `${prefix}pageLoad`;
export const actionTypePageUnload = `${prefix}pageUnload`;
export const actionTypeQuestionLoad = `${prefix}questionLoad`;
export const actionTypeQuestionUnload = `${prefix}questionUnLoad`;
//these event is not intended to be used by redux, rather, it is passed to plugins


export function pageLoadAction(pageGroupInfo, pageInfo, questions){
    return {
        type: actionTypePageLoad,
        pageGroupInfo,
        pageInfo,
        questions
    }
}

export function pageUnloadAction(pageGroupInfo, pageInfo, questions){
    return {
        type: actionTypePageUnload,
        pageGroupInfo,
        pageInfo,
        questions
    }
}

export function questionLoadAction(question, questionDiv){
    return {
        question,
        questionDiv,
        type: actionTypeQuestionLoad
    }
}

export function questionUnloadAction(question, questionDiv) {
    return {
        question,
        questionDiv,
        type: actionTypeQuestionUnload
    }
}