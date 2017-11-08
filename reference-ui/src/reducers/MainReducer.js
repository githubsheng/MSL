import {actionTypePageData} from "../actions/PageActions";
import {answersReducer, isLockedReducer, submitAnswersReducer} from "./AnswerReducer";
import {questionsReducer} from "./QuestionReducer";

//todo: this is fake
const defaultState = {
    //todo: add description here.
    isLocked: false,
    questions: [{
        "id": "q0",
        "type": "single-choice",
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
    }],
    answers: [
        {
            questionId: 'q0',
            selections: ['_generatedIdentifierName2'],
            textInputs: [],
            status: {
                answerTimeInSeconds: 3,
                answeredWhen: Date.now(),
                totalClicks: 3,
                geoLocation: "tokyo..."
            }
        }
    ]
};

//todo: this is fake.
function createFakeAnswers(state){
    return state.questions.map(question => {
        return {
            questionId: question.id,
            selections: []
        }
    });
}

const mainReducer = (state = defaultState, action) => {
    /*
        senario: user clicks submit, UI send the answer data to vm, vm hit a break point, it returns a question data promise
        in this case, the entire process will pause until the promise resolves, then we render the next question/page.
        before the promise resolves, user may again click on the submit button, in this case, we don't want the answer data
        to be sent again.
     */
    if(action.type !== actionTypePageData && state.isLocked) return state;
    const questions = questionsReducer(state, action);
    const answers = answersReducer(state, action);
    const isLocked = isLockedReducer(state, action);
    submitAnswersReducer(state, action);
    return {questions, answers, isLocked};
};

export default mainReducer;