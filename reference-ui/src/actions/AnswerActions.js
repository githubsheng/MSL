/**
 * Created by sheng.wang on 2017/11/07.
 */

const prefix = "answer_";
export const actionTypeSubmitAnswer = `${prefix}submitAnswers`;

export function submitAnswersAction(){
    return {
        type: actionTypeSubmitAnswer
    }
}