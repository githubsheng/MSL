import {List} from "../../node_modules/immutable/dist/immutable";
const prefix = "page_";
export const actionTypePageData = `${prefix}pageData`;

export function pageDataAction(response){
    return {
        type: actionTypePageData,
        token: response.token,
        pageInfo: response.pageInfo,
        questions: List(response.questions)
    }
}