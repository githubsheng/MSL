import {actionTypePageData} from "../actions/PageActions";
import {augmentQuestions} from "./QuestionAugmentReducer";
import {actionTypeSetSelect, actionTypeUpdateForm} from "../actions/AnswerActions";
import {setSelect, updateForm} from "./QuestionAnswerReducer";

export function questionsReducer(state, action, pageInfo, pageGroupInfo){
    switch (action.type) {
        case actionTypePageData:
            return augmentQuestions(state, action, pageInfo, pageGroupInfo);
        case actionTypeSetSelect:
            return setSelect(state, action);
        case actionTypeUpdateForm:
            return updateForm(state, action);
        default:
            return state.questions;
    }
}