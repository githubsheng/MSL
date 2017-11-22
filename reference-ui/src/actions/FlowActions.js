/**
 * Created by sheng.wang on 2017/11/22.
 */
const prefix = "start_";

export const actionTypeStartAnswering = `${prefix}startAnswering`;
export const actionTypeReset = `${prefix}reset`;
export const actionTypeEndOfSurvey = `${prefix}end`;

export function startAnsweringAction(isDebug){
    return {
        isDebug: isDebug,
        type: actionTypeStartAnswering
    }
}

export function endSurveyAction() {
    return {
        type: actionTypeEndOfSurvey
    }
}