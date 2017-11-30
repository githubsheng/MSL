import {actionTypePageData} from "../actions/PageActions";

export function augmentQuestions(action) {
    const questions = action.questions;
    if(action.type === actionTypePageData) {
        return questions.map(augmentQuestion);
    }
    return questions;
}

//this reducer augment a vm passed in question. see reference/questionData for more information.
function augmentQuestion(question){
    question = augmentWithStatsFields(question);
    // question = directAccessToRows(question);
    question = augmentRows(question);
    return question;
}

function augmentWithStatsFields(question) {
    const statsFields = {
        displayedWhen: Date.now(),
        answeredWhen: null,
        duration: 0,
        totalClicks: 0,
        geoLocation: null
    };
    return Object.assign({}, question, statsFields);
}

function augmentRows(question) {
    switch (question.type) {
        case "single-choice":
        case "multiple-choice":
            return augmentNoneMatrixQuestions(question);
        case "single-matrix":
        case "multiple-matrix":
            return augmentMatrixQuestions(question);
    }

    function augmentNoneMatrixQuestions(question){
        const newRows = {};
        Object.entries(question.rows).map(kv => {
            const [rowId, row] = kv;
            newRows[rowId] = Object.assign({}, row, {id: rowId, selected: false});
        });
        return Object.assign({}, question, newRows);
    }

    function augmentMatrixQuestions(question){
        const rowKVs = Object.entries(question.rows);
        const colKVs = Object.entries(question.cols);

        const newRows = {};

        rowKVs.forEach(rowKV => {
            const [rowId, row] = rowKV;
            const newRow = Object.assign({}, row, {id: rowId});

            colKVs.forEach(colKV => {
                const [colId, col] = colKV;
                newRow[colId] = Object.assign({}, col, {id: colId, selected: false});
            });

            newRows[rowId] = newRow;
        });

        return Object.assign({}, question, newRows);
    }
}

// function directAccessToRows(question) {
//     return Object.assign({}, question, question.rows);
// }


