import {actionTypePageData, pageDataAction} from "../actions/PageActions";
import {actionTypeSubmitAnswer, actionTypeSelectRow, actionTypeSelectCol, actionTypeTextInput} from "../actions/AnswerActions";
import * as _ from "lodash";

export function answersReducer(state, action){
    const question = _.find(state.questions, q => q.id === action.questionId);
    switch (action.type) {
        case actionTypeSelectRow:
            return selectRowReducer(question, state.answers, action);
        case actionTypeSelectCol:
            return selectColReducer(question, state.answers, action);
        case actionTypeTextInput:
            throw new Error("text input not supported yet");
        default:
            return state.answers;
    }
}

function selectRowReducer(question, answers, action) {
    const answerData = _.find(answers, ans => ans.questionId === action.questionId);
    let selections;
    switch(question.type) {
        case "single-choice":
            selections = [action.rowId];
            break;
        case "multiple-choice":
            selections = answerData.selections.concat([action.rowId]);
            break;
        default:
            throw new Error("unsupported question type");
    }
    const newAnswerData = Object.assign({}, answerData, {selections});
    return answers.filter(ad => ad.questionId !== action.questionId)
        .concat([newAnswerData]);
}

function selectColReducer(question, answers, action) {
    const answerData = _.find(answers, ans => ans.questionId === action.questionId);
    const comId = `${action.rowId}_${action.colId}`;
    let selections;
    switch(question.type) {
        case "single-matrix":
            selections = [comId];
            break;
        case "multiple-matrix":
            selections = answerData.selections.concat([comId]);
            break;
        default:
            throw new Error("unsupported question type");
    }
    const newAnswerData = Object.assign({}, answerData, {selections});
    return answers.filter(ad => ad.questionId !== action.questionId)
        .concat([newAnswerData]);
}

//todo: this is to be used in answersReducer...
export function statsReducer(state, action) {
    return state.stats;
}

export function submitAnswersReducer(state, action) {
    if (action.type === actionTypeSubmitAnswer) {
        //todo: replace this dummy answers
        const questionsPromise = sendAnswerToInterpreter(state.answers);
        questionsPromise.then(function (questions) {
            action.asyncDispatch(pageDataAction(questions));
        });
    }
}

export function isLockedReducer(state, action) {
    if(action.type === actionTypeSubmitAnswer) {
        return true;
    } else if (action.type === actionTypePageData) {
        return false;
    }
}

//todo: this is fake
function sendAnswerToInterpreter() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve([
                {
                    "id": "q1",
                    "_type": "single-choice",
                    "text": "q1 text",
                    "rows": {
                        "_generatedIdentifierName2": {
                            "text": " aa"
                        },
                        "_generatedIdentifierName3": {
                            "text": " bb"
                        },
                        "_type": "row"
                    }
                },
                {
                    "id": "q2",
                    "_type": "single-choice",
                    "text": "q2 text",
                    "rows": {
                        "_generatedIdentifierName2": {
                            "text": " aa"
                        },
                        "_generatedIdentifierName3": {
                            "text": " bb"
                        },
                        "_type": "row"
                    }
                }
            ])
        }, 100);
    });
}
