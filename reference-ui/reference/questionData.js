//this is the data we would receive from vm
const questions = [{
    id: "q0",
    type: "single-choice",
    text: "q0 text",
    rows: {
        rowId1: {
            text: " row1"
        },
        _generatedIdentifierName2: {
            text: " row2"
        }
    }
}, {
    id: "q1",
    type: "single-matrix",
    text: "q1 text",
    /*
     for now, to access row 1, user would need to do question1.rows.row1

     to find out whether row1 is selected, we need to use question1.rows.row1.selected, ugly, but still acceptable.

     for a matrix question, each row is effectively a sub question, and columns become the options. for instance,
     the following matrix question:
     how do you like the following brand?
     rows: sony, apple
     columns: good, normal, bad

     is effectively a question with two sub questions:
     how do you like the following brand?
     sony
        good normal bad
     apple
        good normal bad
     before a question is answered, copies of cols will be inserted into each rows, and a row structure will look like this
     {
         //this is a row object
         text: "sony",
         colId1: {
            //col1 copy...
            text: ...
            selected: false
         },
         colId2: {
             //col2 copy...
             text: ...
             selected: false
        }
     }
     the reason of doing so is that we can easily use row1.col2 to determine whether a row - column combination is selected or not

     this is good, but to access row1.col2 we have to do this:
     question1.rows.row1.col2.selected.... hmmm, this is too much.
     at the end of the day we want to do this: question1.row1.col2.selected

     this will require us to add the references of rows to questions root level..
     {
         //question object
         text: "hello world",
         rows: {...},
         row1: reference to rows.row1
         row2: reference to rows.row2
     }
     */
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
        }
    },
    cols: {
        _generatedIdentifierName5: {
            text: " col1"
        },
        _generatedIdentifierName6: {
            text: " col2"
        }
    }
}];


//question data reducer should augment the above data once it receives the data
const augmentedQuestions = [{
    id: "q0",
    type: "single-choice",
    text: "q0 text",
    rows: {
        rowId1: {
            text: " row1"
        },
        _generatedIdentifierName2: {
            text: " row2"
        }
    },
    displayedWhen: Date.now(),
    //set when user submit answer
    answeredWhen: null,
    //calculated when user submit answer
    duration: null,
    totalClicks: 0,
    //set when user submit answer...
    geoLocation: null,
    //again, compiler should make sure row id does not conflict with any built in question properties...
    rowId1: {
        text: " row1",
        selected: false
    },
    _generatedIdentifierName2: {
        text: " row2",
        selected: false
    }

}, {
    id: "q1",
    type: "single-matrix",
    text: "q1 text",
    rows: {
        rowId1: {
            text: " row1"
        },
        rowId2: {
            text: " row2"
        }
    },
    cols: {
        colId1: {
            text: " col1"
        },
        colId2: {
            text: " col2"
        }
    },
    displayedWhen: Date.now(),
    answeredWhen: null,
    duration: null,
    totalClicks: 0,
    geoLocation: null,
    //rows direct references
    rowId1: {
        text: " row1",
        //compiler should make sure colId1 and colId2 does not use any built in row attribute name
        //any none built in attribute names will prefixed with an underscore, to make sure it does not
        //conflict with any legal ids.
        colId1: {
            text: " col1",
            selected: false
        },
        colId2: {
            text: " col2",
            selected: false
        }
    },
    rowId2: {
        text: " row2",
        colId1: {
            text: " col1",
            selected: false
        },
        colId2: {
            text: " col2",
            selected: false
        }
    }
}];



