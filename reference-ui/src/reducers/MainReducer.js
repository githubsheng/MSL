import {actionTypeSubmitAnswer} from "../actions/AnswerActions";
import {pageDataAction, actionTypePageData} from "../actions/PageActions";

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

const defaultState = {
    //todo: add description here.
    isLock: false,
    questions: [{
        "id": "q0",
        "_type": "single-choice",
        "text": "q0 text",
        "rows": {
            "_generatedIdentifierName2": {
                "text": " aa"
            },
            "_generatedIdentifierName3": {
                "text": " bb"
            },
            "_type": "row"
        }
    }]
};

const mainReducer = (state = defaultState, action) => {
    //todo: add description here.
    if(action.type !== actionTypePageData && state.isLock) return state;

    if (action.type === actionTypeSubmitAnswer) {
        //todo: replace this dummy answers
        const answers = state.questions.map(question => {
            return {
                questionId: question.id,
                answers: [],
                stats: {}
            }
        });
        const questionsPromise = sendAnswerToInterpreter(answers);
        questionsPromise.then(function (questions) {
            action.asyncDispatch(pageDataAction(questions));
        });
        return {
            isLock: true,
            questions: state.questions
        };
    }
    if (action.type === actionTypePageData) {
        return {
            isLock: false,
            questions: action.questions
        }
    }
    console.log("unrecognized action type...");
    return state;
};

export default mainReducer;