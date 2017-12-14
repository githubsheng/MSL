import {actionTypeSetSelect} from "../actions/AnswerActions";
import {actionTypePageData} from "../actions/PageActions";

export function lastInteractionTimeReducer(state, action) {
    switch (action.type) {
        case actionTypeSetSelect:
            return new Date();
        case actionTypePageData:
            return new Date();
        default:
            return state.lastInteractionTime;
    }
}