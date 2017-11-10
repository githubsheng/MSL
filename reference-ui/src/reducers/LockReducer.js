import {actionTypeSubmitAnswer} from "../actions/AnswerActions";
import {actionTypePageData} from "../actions/PageActions";

export function isLockedReducer(state, action) {
    if(action.type === actionTypeSubmitAnswer) {
        return true;
    } else if (action.type === actionTypePageData) {
        return false;
    }
}
