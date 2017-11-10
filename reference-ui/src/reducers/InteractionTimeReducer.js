import {actionTypeSelect, actionTypeDeselect} from "../actions/AnswerActions";

export function lastInteractionTimeReducer(state, action) {
    switch (action.type) {
        case actionTypeSelect:
        case actionTypeDeselect:
            return new Date();
        default:
            return state.lastInteractionTime;
    }
}