import {actionTypePageData} from "../actions/PageActions";
export function pageGroupInfoReducer(state, action) {
    if(action.type === actionTypePageData) {
        return action.pageGroupInfo;
    }
    return state.pageGroupInfo;
}
