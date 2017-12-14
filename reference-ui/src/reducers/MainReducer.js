import {actionTypePageData} from "../actions/PageActions";
import {submitAnswersReducer} from "./QuestionAnswerReducer";
import {List} from "../../node_modules/immutable/dist/immutable";
import {isLockedReducer} from "./LockReducer";
import {lastInteractionTimeReducer} from "./InteractionTimeReducer";
import {questionsReducer} from "./QuestionsReducer";
import {defaultState, flowReducer} from "./FlowReducer";
import {actionTypeEndOfSurvey, actionTypeReset} from "../actions/FlowActions";
import {pageGroupInfoReducer} from "./pageGroupInfoReducer";
import {pageInfoReducer} from "./pageInfoReducer";
import {pluginManager} from "../plugins/pluginManager";

const mainReducer = (state = defaultState, action) => {
    /*
        senario: user clicks submit, UI send the answer data to vm, vm hit a break point, it returns a question data promise
        in this case, the entire process will pause until the promise resolves, then we render the next question/page.
        before the promise resolves, user may again click on the submit button, in this case, we don't want the answer data
        to be sent again.
     */
    if(state.isLocked) {
        switch (action.type) {
            case actionTypePageData:
            case actionTypeEndOfSurvey:
            case actionTypeReset:
                break;
            default:
                return state;
        }
    }

    pluginManager.passEventsToPlugins(action);

    const ret = flowReducer(state, action);
    if(ret) return ret;

    submitAnswersReducer(state, action);
    const isLocked = isLockedReducer(state, action);
    const lastInteractionTime = lastInteractionTimeReducer(state, action);
    const pageInfo = pageInfoReducer(state, action);
    const pageGroupInfo = pageGroupInfoReducer(state, action);
    const questions = questionsReducer(state, action, pageInfo, pageGroupInfo);


    return {
        pageInfo,
        pageGroupInfo,
        questions,
        isLocked,
        lastInteractionTime,
        token: state.token,
        isStarted: state.isStarted,
        isEnded: state.isEnded,
        jsPluginImports: state.jsPluginImports,
        cssPluginImports: state.cssPluginImports
    };
};

export default mainReducer;