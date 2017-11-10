//this reducer augment a vm passed in question. see reference/questionData for more information.
export function questionsReducer(question, action){
    //todo: for each question, do this...
    question = augmentWithStatsFields(question);
    question = augmentRows(question);
    question = directAccessToRows(question);
    return question;
}

function augmentRows(question) {
    //todo: if question is none matrix questions, add selected: false to each row
    switch (question.type) {
        case "single-choice":
        case "multiple-choice":
            return augmentNoneMatrixQuestions();
        case "single-matrix":
        case "multiple-matrix":
            return augmentMatrixQuestions();
    }

    function augmentNoneMatrixQuestions(){
        const newRows = {};
        Object.entries(question.rows).map(kv => {
            const [rowId, row] = kv;
            newRows[rowId] = Object.assign({}, row, {selected});
        });
        return Object.assign({}, question, {rows: newRows});
    }

    function augmentMatrixQuestions(){
        const rowKVs = Object.entries(question.rows);
        const colKVs = Object.entries(question.cols);

        const newRows = {};

        rowKVs.forEach(rowKV => {
            const [rowId, row] = rowKV;
            const newRow = Object.assign({}, row);

            colKVs.forEach(colKV => {
                const [colId, col] = colKV;
                newRow[colId] = Object.assign({}, col, {selected: false});
            });

            newRows[rowId] = newRow;
        });

        return Object.assign({}, question, {rows: newRows});
    }
}

function directAccessToRows(question) {
    return Object.assign({}, question, question.rows);
}

function augmentWithStatsFields(question) {
    const statsFields = {
        displayedWhen: Date.now(),
        answeredWhen: null,
        time: null,
        totalClicks: 0,
        geoLocation: null
    };
    return Object.assign({}, question, statsFields);
}
