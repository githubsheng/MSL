import {actionTypePageData} from "../actions/PageActions";
import {isPropertyValueTrue, rotate, shuffle} from "../util/util";
import {List} from "../../node_modules/immutable/dist/immutable";

export function augmentQuestions(state, action, pageInfo, pageGroupInfo) {
    const _questions = action.questions;
    if (isPropertyValueTrue(pageInfo.randomize)) shuffle(_questions);
    if (isPropertyValueTrue(pageInfo.rotate)) rotate(_questions);

    const questions = List(_questions);

    if (action.type === actionTypePageData) {
        return questions.map(augmentQuestion);
    }
    return questions;
}

//this reducer augment a vm passed in question. see reference/questionData for more information.
function augmentQuestion(question) {
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

    function reduceOptionFieldToArrayOfOptionObj(ret, kv) {
        const [key, value] = kv;
        //List is not visible here because of the way it packas the code, so we checks id to
        //determine whether value is a list or row object (row object must have an id)
        if (!value.id) {
            //value is an list of row objects.
            return ret.concat(value._elements);
        } else {
            //value is an row object.
            return ret.concat([value]);
        }
    }

    function augmentNoneMatrixQuestions(question) {
        /*
         we copy the all the rows in question.rows, augment the copies, and make the copies a direct field of question. The rows in question.rows will
         not be augmented / changed and serve as a reference only.
         so this is the question looks like originally:
         {
         rows: {
         rowId1: {text: "hello"},
         rowId2: {text: "world"}
         }
         },
         this is how it looks like after we change it.
         {
         rows: {
         rowId1: {text: "hello"},
         rowId2: {text: "world"}
         },
         rowId1: {
         id: "rowId1",
         text: "hello",
         selected: false
         },
         rowId2: {
         id: "rowId1",
         text: "world",
         selected: false
         }
         }
         after the change, we can now do:
         question.rowId1.text
         as opposed to
         question.rows.rowId1.text

         also, questions.rows only serve as a reference, when we assign answer data, we only modify question.rowId1, rather than question.rows.rowId1.
         */
        const newRows = {};
        //we collects all row ids into this array so that it is easier to loop over row ids later, and whenever we render the rows, we will
        //use the orders in this array.
        const rowIds = [];
        const rows = Object.entries(question.rows).reduce(reduceOptionFieldToArrayOfOptionObj, []);
        rows.map(row => {
                rowIds.push(row.id);
                newRows[row.id] = Object.assign({}, row, {selected: false});
            });
        if (isPropertyValueTrue(question.randomize)) shuffle(rowIds);
        if (isPropertyValueTrue(question.rotate)) rotate(rowIds);
        return Object.assign({}, question, newRows, {rowIds});
    }

    function augmentMatrixQuestions(question) {
        const rows = Object.entries(question.rows).reduce(reduceOptionFieldToArrayOfOptionObj, []);
        const cols = Object.entries(question.cols).reduce(reduceOptionFieldToArrayOfOptionObj, []);

        const newRows = {};
        //we collects all row ids into this array so that it is easier to loop over row ids later, and whenever we render the rows, we will
        //use the orders in this array.
        const rowIds = [];

        rows.forEach(row => {
            rowIds.push(row.id);
            const newRow = Object.assign({}, row);
            cols.forEach(col => {
                newRow[col.id] = Object.assign({}, col, {selected: false});
            });

            newRows[row.id] = newRow;
        });

        if (isPropertyValueTrue(question.randomize)) shuffle(rowIds);
        if (isPropertyValueTrue(question.rotate)) rotate(rowIds);

        //same for colIds, like rowIds
        const colIds = [];
        cols.forEach(col => {
            colIds.push(col.id);
        });

        if (isPropertyValueTrue(question.randomizeCol)) shuffle(colIds);
        if (isPropertyValueTrue(question.rotateCol)) rotate(colIds);

        return Object.assign({}, question, newRows, {rowIds}, {colIds});
    }
}
