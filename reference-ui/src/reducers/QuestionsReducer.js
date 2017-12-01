import {actionTypePageData} from "../actions/PageActions";
import {augmentQuestions} from "./QuestionAugmentReducer";
import {actionTypeSetSelect} from "../actions/AnswerActions";
import {setSelect} from "./QuestionAnswerReducer";

export function questionsReducer(state, action, pageInfo, pageGroupInfo){
    switch (action.type) {
        case actionTypePageData:
            return augmentQuestions(state, action, pageInfo, pageGroupInfo);
        case actionTypeSetSelect:
            return setSelect(state, action);
        default:
            return state.questions;
    }
}