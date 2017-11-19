import {actionTypeSetSelect} from "../actions/AnswerActions";

export function lastInteractionTimeReducer(state, action) {
    switch (action.type) {
        case actionTypeSetSelect:
            return new Date();
        default:
            return state.lastInteractionTime;
    }
}