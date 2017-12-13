import {actionTypePageData} from "../actions/PageActions";
import {isPropertyValueTrue, rotate, shuffle} from "../util/util";
import {List} from "../../node_modules/immutable/dist/immutable";

export function augmentQuestions(state, action, pageInfo, pageGroupInfo) {
    const _questions = action.questions;
    if (isPropertyValueTrue(pageInfo.randomize)) shuffle(_questions);
    if (isPropertyValueTrue(pageInfo.rotate)) rotate(_questions);

    const questions = List(_questions);

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
        default:
            return question;
    }

    function augmentNoneMatrixQuestions(question){
        const newRows = {};
        //we collects all row ids into this array so that it is easier to loop over row ids later, and whenever we render the rows, we will
        //use the orders in this array.
        const rowIds = [];
        Object.entries(question.rows).map(kv => {
            const [rowId, row] = kv;
            rowIds.push(rowId);
            newRows[rowId] = Object.assign({}, row, {id: rowId, selected: false});
        });
        if (isPropertyValueTrue(question.randomize)) shuffle(rowIds);
        if (isPropertyValueTrue(question.rotate)) rotate(rowIds);
        return Object.assign({}, question, newRows, {rowIds});
    }

    function augmentMatrixQuestions(question){
        const rowKVs = Object.entries(question.rows);
        const colKVs = Object.entries(question.cols);

        const newRows = {};
        //we collects all row ids into this array so that it is easier to loop over row ids later, and whenever we render the rows, we will
        //use the orders in this array.
        const rowIds = [];

        rowKVs.forEach(rowKV => {
            const [rowId, row] = rowKV;
            rowIds.push(rowId);
            const newRow = Object.assign({}, row, {id: rowId});
            colKVs.forEach(colKV => {
                const [colId, col] = colKV;
                newRow[colId] = Object.assign({}, col, {id: colId, selected: false});
            });

            newRows[rowId] = newRow;
        });

        if (isPropertyValueTrue(question.randomize)) shuffle(rowIds);
        if (isPropertyValueTrue(question.rotate)) rotate(rowIds);

        //same for colIds, like rowIds
        const colIds = [];
        colKVs.forEach(colKV => {
            const [colId] = colKV;
            colIds.push(colId);
        });

        if(isPropertyValueTrue(question.randomizeCol)) shuffle(colIds);
        if(isPropertyValueTrue(question.rotateCol)) rotate(colIds);

        return Object.assign({}, question, newRows, {rowIds}, {colIds});
    }
}

// function directAccessToRows(question) {
//     return Object.assign({}, question, question.rows);
// }


