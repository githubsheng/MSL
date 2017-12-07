/**
 * Created by sheng.wang on 2017/12/06.
 */

const prefix = "plugin_";

export const actionTypePageMounted = `${prefix}pageMounted`;
export const actionTypePageUpdated = `${prefix}pageChanged`;
export const actionTypeQuestionChanged = `${prefix}questionChanged`;
//these event is not intended to be used by redux, rather, it is passed to plugins

//this event is emitted when the we go from one question page to another
export function pageChangedAction(pageGroupInfo, pageInfo, questions){
    return {
        type: actionTypePageUpdated,
        pageGroupInfo,
        pageInfo,
        questions
    }
}

//this event is emitted when the question page get mounted for the first time.
//this is the good time if we want to make some permanent changes like changing the banner...
//if you use pageChangedAction to style the banner then the banner will be uncessarily styled many many time
//notice at this point the questions are not rendered yet.
export function pageMountedAction(){
    return {
        type: actionTypePageMounted
    }
}

/*
    there is no question mount action because we render a list of questions on the same page. And the difference
    between a mount and update is ambiguous, for instance, previously we have question 1, 2, 3 on the page, now
    if we render 5, 6, 7, 8. if this case, 1, 2, 3 will be updated to 5, 6, 7 (even though 5, 6, 7 is showing up
    for the first time, but technically it is an update), and question 8 will be created and mounted.

    to make things simpler we just have question changed action (for both update and mount)
 */
export function questionChangedAction(question, questionDiv){
    return {
        question,
        questionDiv,
        type: actionTypeQuestionChanged
    }
}