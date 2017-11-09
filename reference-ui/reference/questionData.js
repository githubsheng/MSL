/**
 * Created by sheng.wang on 2017/11/09.
 */

//this is the data we would receive from vm
const questions = [{
    id: "q0",
    type: "single-choice",
    text: "q0 text",
    rows: {
        _generatedIdentifierName1: {
            text: " row1"
        },
        _generatedIdentifierName2: {
            text: " row2"
        },
        type: "row"
    }
}, {
    id: "q1",
    type: "single-matrix",
    text: "q1 text",
    rows: {
        _generatedIdentifierName3: {
            text: " row1",
            //compiler should make sure colId1 and colId2 does not use any built in row attribute name
            hide: false,
            //any none built in attribute names will prefixed with an underscore, to make sure it does not
            //conflict with any user defined ids (user defined ids cannot start with an underscore)
            //so [Row useThisPlugin={true}]row1, when converted to an object,
            //will have a property named `_useThisPlugin` rather than `useThisPlugin`
            _useThisPlugin: false
        },
        _generatedIdentifierName4: {
            text: " row2"
        },
        type: "row"
    },
    cols: {
        _generatedIdentifierName5: {
            text: " col1"
        },
        _generatedIdentifierName6: {
            text: " col2"
        },
        type: "col"
    }
}];


//question data reducer should augment the above data once it receives the data
const augmentedQuestions = [{
    id: "q0",
    type: "single-choice",
    text: "q0 text",
    rows: {
        _generatedIdentifierName1: {
            text: " row1",
            selected: false
        },
        _generatedIdentifierName2: {
            text: " row2",
            selected: false
        },
        type: "row"
    },
    displayedWhen: Date.now(),
    //set when user submit answer
    answeredWhen: null,
    //calculated when user submit answer
    time: null,
    totalClicks: 0,
    //set when user submit answer...
    geoLocation: null
}, {
    id: "q1",
    type: "single-matrix",
    text: "q1 text",
    rows: {
        rowId1: {
            text: " row1",
            //compiler should make sure colId1 and colId2 does not use any built in row attribute name
            //any none built in attribute names will prefixed with an underscore, to make sure it does not
            //conflict with any legal ids.
            colId1: referenceToColId1,
            colId2: referenceToColId2
        },
        rowId2: {
            text: " row2",
            colId1: referenceToColId1,
            colId2: referenceToColId2
        },
        type: "row"
    },
    cols: {
        colId1: {
            text: " col1",
            selected: false
        },
        colId2: {
            text: " col2",
            selected: false
        },
        type: "col"
    },
    displayedWhen: Date.now(),
    answeredWhen: null,
    time: null,
    totalClicks: 0,
    geoLocation: null
}];



