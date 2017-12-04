import {
    actionTypeEndOfSurvey, actionTypeFirstQuestionLoaded, actionTypeReset, actionTypeStartAnswering,
    firstQuestionLoadedAction
} from "../actions/FlowActions";
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
    questions: List(),
    pageInfo: {},
    pageGroupInfo: {},
    jsPluginImports: List(),
    cssPluginImports: List()
};

export function flowReducer(state, action) {
    switch (action.type) {
        case actionTypeReset:
            return reset(state, action);
        case actionTypeStartAnswering:
            return startAnswering(state, action);
        case actionTypeEndOfSurvey:
            return endSurvey(state, action);
        case actionTypeFirstQuestionLoaded:
            return firstQuestionLoaded(state, action);
        default:
            return null;
    }
}

function reset(state, action){
    const changes = {
        token: Date.now().toString(),
        isDebug: action.isDebug,
        jsPluginImports: List(action.jsPluginImports),
        cssPluginImports: List(action.cssPluginImports)
    };
    return Object.assign({}, defaultState, changes);
}

function startAnswering(state, action){
    const firstQuestionPromise = state.isDebug ? restartDebug(state.token) : restartRun(state.token);
    firstQuestionPromise.then(function(response){
        if(response.token === state.token) {
            action.asyncDispatch(firstQuestionLoadedAction());
            action.asyncDispatch(pageDataAction(response));
        }
    });
    return state;
}

function firstQuestionLoaded(state, action) {
    return Object.assign({}, state, {isStarted: true});
}

function endSurvey(state, action) {
    return Object.assign({}, state, {isEnded: true});
}

function restartDebug(token){
    return window.isDev? fakeData(token) : window.interpreter.restartDebug(token);
}

function restartRun(token){
    return window.isDev? fakeData(token) : window.interpreter.restartRun(token);
}

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
                pageGroupInfo: {
                    attrib2: "evaluated attrib2"
                },
                questions,
                token: token
            });
        }, 100);
    });
}