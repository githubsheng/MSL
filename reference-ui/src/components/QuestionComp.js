import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import {Row} from './RowComp';

class Question extends PureComponent {
    render (){

        const {question, setSelect} = this.props;

        let colsWithId = null;
        if(question.cols) {
            colsWithId = Object.entries(question.cols).map(colKV => {
               const [colId, col] = colKV;
               return Object.assign({}, col, {id: colId});
            });
        }

        const rowComps = Object.entries(question.rows).map(rowKV => {
            const [rowId, row] = rowKV;
            const rowWithId = Object.assign({}, row, {id: rowId});

            switch (question.type) {
                case "single-choice":
                    return <Row key={rowId} row={rowWithId} type="radio" question={question} setSelect={setSelect}/>;
                case "multiple-choice":
                    return <Row key={rowId} row={rowWithId} type="checkbox" question={question} setSelect={setSelect}/>;
                default:
                    throw new Error("question type not yet supported");
            }
        });

        return (
            <div className="question">
                <div className="above-question-text"></div>
                <div className="question-text">{question.text}</div>
                <div className="below-question-text"></div>
                <div className="rows-container">{rowComps}</div>
            </div>
        );
    }
}

export default Question;