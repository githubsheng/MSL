import {pageDataAction} from "../actions/PageActions";
import {actionTypeSetSelect, actionTypeSubmitAnswer, actionTypeUpdateForm} from "../actions/AnswerActions";
import * as R from "ramda";
import {actionTypeEndOfSurvey, endSurveyAction} from "../actions/FlowActions";

export function updateForm(state, action) {
    if(action.type !== actionTypeUpdateForm) return state.questions;

    const {questionId, name, value} = action;

    const questions = state.questions;
    const questionIndex = getQuestionIndexById(questions, questionId);
    const question = questions.get(questionIndex);

    const questionChanges = {form: {}};
    questionChanges.form[name] = value;

    const c1 = questionTimeRecordChanges(question, state.lastInteractionTime);
    Object.assign(questionChanges, c1);

    const newQuestion = R.mergeDeepRight(question, questionChanges);
    return questions.set(questionIndex, newQuestion);
}

export function setSelect(state, action) {
    if(action.type !== actionTypeSetSelect) return state.questions;
    const questions = state.questions;
    const {rowId, colId, questionId, val} = action;
    const questionIndex = getQuestionIndexById(questions, questionId);
    const question = questions.get(questionIndex);
    const questionChanges = {};

    if (colId === undefined || colId === null) {
        questionChanges[rowId] = {selected: val};
        //for single choices, we need to set selected in other rows to be false.
        if(question.type === "single-choice") {
            Object.entries(question.rows).forEach(rowKV => {
                const [rId] = rowKV;
                if(rId !== rowId) {
                    questionChanges[rId] = {selected: false};
                }
            });
        }
    } else {
        questionChanges[rowId] = {};
        //for single matrix, we need to set selected in other cols under this row to be false.
        questionChanges[rowId][colId] = {selected: val};
        if(question.type === "single-matrix") {
            Object.entries(question.cols).forEach(colKV => {
                const [cId] = colKV;
                if(cId !== colId) {
                    questionChanges[rowId][cId] = {selected: false};
                }
            })
        }
    }

    const c1 = questionTimeRecordChanges(question, state.lastInteractionTime);
    const c2 = questionTotalClickChanges(question.totalClicks);
    Object.assign(questionChanges, c1, c2);

    const newQuestion = R.mergeDeepRight(question, questionChanges);

    return questions.set(questionIndex, newQuestion);
}

/*
 the answeredWhen will be the last time user select/deselect any options, rather than the time user hit submit button
 for instance, when a page displays 2 single choice
 when user selects row 1 in question 1 -> time user answered question 1
 when user selects row 3 in question 2 -> time user answered question 2
 when user goes back to change question 1's answer to row 2 -> (new) time user answered question 1.

 how to calculate the time it takes to answer (duration) each question?

 for every question

 //initially
 question.duration = 0

 //when user selects/deselects an option (interact with the question), we update its answeredWhen
 //the last question user interacted with, we called it lastQuestion
 question.duration = question.duration + (question.answeredWhen - lastQuestion.answeredWhen)

 //if question is the first question user interacts with, ie, there is no lastQuestion, then
 question.duration = question.duration + (question.answeredWhen - pageDisplayedWhen)

 the above equations can be summarized to be:
 user interacts with questionX
 questionX.answeredWhen = now
 questionX.duration = questionX.duration + (questionX.answeredWhen - lastInteractionTime)
 lastInteractionTime = questionX.answeredWhen

 we record lastInteractionTime in the root state.

 using the one page two single choices questions example above:
 page displayed -> time 1 (we assuming user starts to see question 1)
 user selects row 1 in question 1 -> time 2 (question1.answeredWhen = time 2)

 //so user starts to look at question 1 at time 1, and made a choice at time 2. duration is time 2 - time 1
 question1.duration = 0 + (time 2 - time 1)

 user selects row 3 in question 2 -> time 3 (question2.answeredWhen = time 3)

 //we assumes user finishes question 1 at time 2, and then starts to do question 2, so duration of question 2 is time 3 - time 2
 question2.duration = 0 + (time 3 - time 2)

 user goes back to selects row 2 in question 1 -> time 4
 question1.answeredWhen = time 4

 //the total duration of question 1 should be (time it takes to select row 1) + (time it takes to change mind and select row 2)
 //we assumes, after answering the last question (last question user interacted with, question2 in this case), user starts to review question 1
 //so the time it takes to review question 1 is time 4 - time 3
 question1.duration = question1.duration + (time 4 - time 3)
 */
function questionTimeRecordChanges(question, lastInteractionTime) {
    const now = new Date();
    return {
        answeredWhen: now,
        duration: question.duration + (now.getTime() - lastInteractionTime.getTime())
    };
}

function questionTotalClickChanges(currentClicks) {
    return {
        totalClicks: ++currentClicks
    }
}

function getQuestionsById(questions, id) {
    return questions.find(q => q.id === id);
}

function getQuestionIndexById(questions, id) {
    return questions.findIndex(q => q.id === id);
}

export function submitAnswersReducer(state, action) {
    if (action.type === actionTypeSubmitAnswer) {
        const questionsPromise = sendAnswerToInterpreter(state.questions.toArray());
        questionsPromise.then(function (response) {
            if(response.token === state.token) {
                if(!response.questions || response.questions.length === 0) {
                    action.asyncDispatch(endSurveyAction());
                } else {
                    action.asyncDispatch(pageDataAction(response));
                }
            }
        });
    }
}

function sendAnswerToInterpreter(questionsWithAnswers) {
    return window.interpreter.submitAnswer(questionsWithAnswers);
}
