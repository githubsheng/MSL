import {actionTypePageData} from "../actions/PageActions";
export function pageInfoReducer(state, action) {
    if(action.type === actionTypePageData) {
        return action.pageInfo;
    }
    return state.pageInfo;
}
