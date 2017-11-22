import {actionTypeEndOfSurvey, actionTypeReset, actionTypeStartAnswering} from "../actions/FlowActions";
import {List} from "../../node_modules/immutable/dist/immutable";
import {pageDataAction} from "../actions/PageActions";

//todo: for default state we need to display a welcome page..., we add a separate field to mark the welcome page status...
//todo: each status should have a token generated when we restart, everything response from vm should carry that token
//todo: if a response is not with current token, that response is a response of a request sent in the previous cycle.(before we restart)
export const defaultState = {
    //see comments in mainReducer
    isLocked: false,
    isStarted: false,
    isEnded: false,
    token: Date.now().toString(),
    lastInteractionTime: new Date(),
    questions: List()
};

export function flowReducer(state, action) {
    switch (action.type) {
        case actionTypeReset:
            return reset();
        case actionTypeStartAnswering:
            return startAnswering(state, action);
        case actionTypeEndOfSurvey:
            return endSurvey(state, action);
        default:
            return null;
    }
}

function reset(){
    return Object.assign({}, defaultState, {token: Date.now().toString()});
}

function startAnswering(state, action){
    let firstQuestionPromise;
    if(action.isDebug) {
        firstQuestionPromise = restartDebug(state.token);
    } else {
        firstQuestionPromise = restartRun(state.token);
    }
    firstQuestionPromise.then(function(response){
        if(response.token === state.token) {
            action.asyncDispatch(pageDataAction(response));
        }
    });
    return Object.assign({}, state, {isStarted: true});
}

function endSurvey(state, action) {
    return Object.assign({}, state, {isEnded: true});
}

function restartDebug(token){
    //todo: in real case, call vm.restartDebug();
    return fakeData(token);
}

function restartRun(token){
    //todo: in real case, call vm.restartRun();
    return fakeData(token);
}

//todo: this returns fake data
function fakeData(token){
    //see sendAnswerToInterpreter in QuestionAnswerReducer
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            const questions = [
                {
                    id: "q1",
                    type: "single-choice",
                    text: "q1 text" + Date.now(),
                    rows: {
                        _generatedIdentifierName2: {
                            "text": " aa"
                        },
                        _generatedIdentifierName3: {
                            "text": " bb"
                        }
                    }
                },
                {
                    id: "q2",
                    type: "multiple-choice",
                    text: "q2 text",
                    rows: {
                        _generatedIdentifierName4: {
                            "text": " aa"
                        },
                        _generatedIdentifierName5: {
                            "text": " bb"
                        }
                    }
                },
                {
                    id: "q3",
                    type: "single-matrix",
                    text: "q3 text",
                    rows: {
                        _generatedIdentifierName6: {
                            text: " aa"
                        },
                        _generatedIdentifierName7: {
                            text: " bb"
                        }
                    },
                    cols: {
                        _generatedIdentifierName5: {
                            text: " col1"
                        },
                        _generatedIdentifierName6: {
                            text: " col2"
                        }
                    }
                }
            ];

            resolve({
                pageInfo: {
                    attrib1: "evaluated attrib1"
                },
                questions,
                token: token
            });
        }, 100);
    });
}