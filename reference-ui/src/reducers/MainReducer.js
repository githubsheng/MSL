import {actionTypePageData} from "../actions/PageActions";
import {answersReducer, isLockedReducer, submitAnswersReducer} from "./AnswerReducer";
import {questionsReducer} from "./QuestionReducer";

//todo: this is fake
const defaultState = {
    //see comments in mainReducer
    isLocked: false,
    questions: []
};

const mainReducer = (state = defaultState, action) => {
    /*
        senario: user clicks submit, UI send the answer data to vm, vm hit a break point, it returns a question data promise
        in this case, the entire process will pause until the promise resolves, then we render the next question/page.
        before the promise resolves, user may again click on the submit button, in this case, we don't want the answer data
        to be sent again.
     */
    if(action.type !== actionTypePageData && state.isLocked) return state;
    const isLocked = isLockedReducer(state, action);

    let questions = state.questions;
    questions = questionsReducer(questions, action);
    questions = answersReducer(questions, action);
    questions = submitAnswersReducer(questions, action);
    return {questions, isLocked};
};

export default mainReducer;