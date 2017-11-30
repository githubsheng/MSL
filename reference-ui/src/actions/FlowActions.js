const prefix = "flow_";

export const actionTypeStartAnswering = `${prefix}startAnswering`;
export const actionTypeReset = `${prefix}reset`;
export const actionTypeEndOfSurvey = `${prefix}end`;
export const actionTypeFirstQuestionLoaded = `${prefix}firstQuestionLoaded`;

export function resetSurveyAction(isDebug){
    return {
        isDebug: isDebug,
        type: actionTypeReset
    }
}

export function startAnsweringAction(){
    return {
        type: actionTypeStartAnswering
    }
}

export function firstQuestionLoadedAction(){
    return {
        type: actionTypeFirstQuestionLoaded
    }
}

export function endSurveyAction() {
    return {
        type: actionTypeEndOfSurvey
    }
}