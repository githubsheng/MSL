const prefix = "page_";
export const actionTypePageData = `${prefix}pageData`;

export function pageDataAction(questions){
    return {
        type: actionTypePageData,
        questions
    }
}