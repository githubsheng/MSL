import {List} from "../../node_modules/immutable/dist/immutable";
const prefix = "page_";
export const actionTypePageData = `${prefix}pageData`;
export const actionTypePageUpdated = `${prefix}pageUpdated`;

export function pageDataAction(response){
    return {
        type: actionTypePageData,
        token: response.token,
        pageInfo: response.pageInfo,
        pageGroupInfo: response.pageGroupInfo,
        questions: response.questions
    }
}

//this event is not intended to be used by redux, rather, it is passed to plugins
export function pageUpdatedAction(pageGroupInfo, pageInfo, questions){
    return {
        type: actionTypePageUpdated,
        pageGroupInfo,
        pageInfo,
        questions
    }
}