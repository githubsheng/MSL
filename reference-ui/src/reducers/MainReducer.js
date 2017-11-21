import {actionTypePageData} from "../actions/PageActions";
import {submitAnswersReducer} from "./QuestionAnswerReducer";
import {List} from "../../node_modules/immutable/dist/immutable";
import {isLockedReducer} from "./LockReducer";
import {lastInteractionTimeReducer} from "./InteractionTimeReducer";
import {questionsReducer} from "./QuestionsReducer";

//todo: for default state we need to display a welcome page..., we add a separate field to mark the welcome page status...
//todo: each status should have a token generated when we restart, everything response from vm should carry that token
//todo: if a response is not with current token, that response is a response of a request sent in the previous cycle.(before we restart)
const defaultState = {
    //see comments in mainReducer
    isLocked: false,
    lastInteractionTime: new Date(),
    questions: List()
};

//todo: here, add a reset action, and a reset reducer. when reset action is received, reset the status to default status (with a new token)
//todo: add a start answering action (action sent when user click on the start button on welcome page), a corresponding reducer, that reducer would call vm's restart function.
//todo: that is, everything will be initiated from UI. the vm is like backend server, only reacts when called by ui.
//todo: add a welcome page component
//todo: add a end page component.
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