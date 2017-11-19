/**
 * Created by sheng.wang on 2017/11/07.
 */

const prefix = "answer_";
export const actionTypeSubmitAnswer = `${prefix}submitAnswers`;
export const actionTypeSelect = `${prefix}select`;
export const actionTypeDeselect = `${prefix}deselect`;

export function submitAnswersAction(){
    return {
        type: actionTypeSubmitAnswer
    }
}

export function select(questionId, rowId, colId){
    return {
        type: actionTypeSelect,
        questionId,
        rowId,
        colId
    }
}

export function deselect(questionId, rowId, colId) {
    return {
        type: actionTypeDeselect,
        questionId,
        rowId,
        colId
    }
}