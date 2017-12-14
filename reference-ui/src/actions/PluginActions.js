const prefix = "plugin_";

//these event is not intended to be used by redux, rather, it is passed to plugins
export const actionTypePageLoad = `${prefix}pageLoad`;
export const actionTypePageUnload = `${prefix}pageUnload`;
export const actionTypeQuestionLoad = `${prefix}questionLoad`;
export const actionTypeQuestionUnload = `${prefix}questionUnLoad`;

export function pageLoadAction(pageGroupInfo, pageInfo, questions, pageDiv){
    return {
        type: actionTypePageLoad,
        pageGroupInfo,
        pageInfo,
        questions,
        pageDiv
    }
}

export function pageUnloadAction(pageGroupInfo, pageInfo, questions, pageDiv){
    return {
        type: actionTypePageUnload,
        pageGroupInfo,
        pageInfo,
        questions,
        pageDiv
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