/**
 * Created by sheng.wang on 2017/11/07.
 */

const prefix = "answer_";
export const actionTypeSubmitAnswer = `${prefix}submitAnswers`;
export const actionTypeSelectRow = `${prefix}selectRow`;
export const actionTypeSelectCol = `${prefix}selectCol`;
export const actionTypeTextInput = `${prefix}textInput`;

export function submitAnswersAction(){
    return {
        type: actionTypeSubmitAnswer
    }
}

export function selectRow(questionId, rowId){
    return {
        type: actionTypeSelectRow,
        questionId,
        rowId
    }
}

export function selectCol(questionId, rowId, colId) {
    return {
        type: actionTypeSelectCol,
        questionId,
        rowId,
        colId
    }
}

export function selectTextInput(questionId, inputId, value) {
    return {
        type: actionTypeTextInput,
        questionId,
        inputId,
        value
    }
}