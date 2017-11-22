const prefix = "answer_";
export const actionTypeSubmitAnswer = `${prefix}submitAnswers`;
export const actionTypeSetSelect = `${prefix}setSelect`;

export function submitAnswersAction(){
    return {
        type: actionTypeSubmitAnswer
    }
}

export function setSelectAction(questionId, rowId, colId, val){
    return {
        type: actionTypeSetSelect,
        questionId,
        rowId,
        colId,
        val
    }
}