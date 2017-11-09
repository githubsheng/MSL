import {actionTypePageData, pageDataAction} from "../actions/PageActions";
import {actionTypeSubmitAnswer} from "../actions/AnswerActions";

export function answersReducer(state, action){

}

function selectReducer(state, action) {

}

function deselectReducer(state, action) {

}

function answeredWhenReducer(state, action) {

}

function totalClickReducer(state, action) {

}

function geoLocationReducer(state, action) {

}

function answerTimeInSecondsReducer(state, action) {

}

function delayedStatsReducer(state, action) {

}

export function submitAnswersReducer(state, action) {
    if (action.type === actionTypeSubmitAnswer) {
        //todo: replace this dummy answers
        const answeredWhen = answeredWhenReducer(state);
        const geoLocation = geoLocationReducer(state);
        const answerTimeInSeconds = answerTimeInSecondsReducer(state);
        const questionsWithAnswers = delayedStatsReducer(state, answeredWhen, geoLocation, answerTimeInSeconds);
        const questionsPromise = sendAnswerToInterpreter(questionsWithAnswers);
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
                    "type": "single-choice",
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
                    "type": "single-choice",
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
