import {actionTypePageData} from "../actions/PageActions";
import {augmentQuestions} from "./QuestionAugmentReducer";
import {actionTypeSelect, actionTypeDeselect} from "../actions/AnswerActions";
import {select, deselect} from "./QuestionAnswerReducer";

export function questionsReducer(state, action){
    switch (action.type) {
        case actionTypePageData:
            return augmentQuestions(action.questions, action);
        case actionTypeSelect:
            return select(state.questions, action);
        case actionTypeDeselect:
            return deselect(state.questions, action);
        default:
            return state.questions;
    }
}