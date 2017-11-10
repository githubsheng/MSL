import {actionTypePageData} from "../actions/PageActions";
import {submitAnswersReducer} from "./QuestionAnswerReducer";
import {List} from "../../node_modules/immutable/dist/immutable";
import {isLockedReducer} from "./LockReducer";
import {lastInteractionTimeReducer} from "./InteractionTimeReducer";
import {questionsReducer} from "./QuestionsReducer";

//todo: for default state we need to display a welcome page...
const defaultState = {
    //see comments in mainReducer
    isLocked: false,
    lastInteractionTime: new Date(),
    questions: List()
};

const mainReducer = (state = defaultState, action) => {
    /*
        senario: user clicks submit, UI send the answer data to vm, vm hit a break point, it returns a question data promise
        in this case, the entire process will pause until the promise resolves, then we render the next question/page.
        before the promise resolves, user may again click on the submit button, in this case, we don't want the answer data
        to be sent again.
     */
    if(action.type !== actionTypePageData && state.isLocked) return state;
    submitAnswersReducer(state, action);
    const isLocked = isLockedReducer(state, action);
    const lastInteractionTime = lastInteractionTimeReducer(state, action);
    const questions = questionsReducer(state, action);
    const pageInfo = state.pageInfo;
    return {pageInfo, questions, isLocked, lastInteractionTime};
};

export default mainReducer;