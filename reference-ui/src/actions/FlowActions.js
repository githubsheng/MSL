const prefix = "flow_";

export const actionTypeStartAnswering = `${prefix}startAnswering`;
export const actionTypeReset = `${prefix}reset`;
export const actionTypeEndOfSurvey = `${prefix}end`;

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

export function endSurveyAction() {
    return {
        type: actionTypeEndOfSurvey
    }
}