import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import {Row, RowWithColumns} from './RowComp';

class Question extends PureComponent {
    render (){

        const {question, setSelect} = this.props;

        const rowComps = Object.entries(question.rows).map(rowKV => {
            const [rowId] = rowKV;
            const row = question[rowId];
            switch (question.type) {
                case "single-choice":
                    return <Row key={rowId} row={row} type="radio" question={question} setSelect={setSelect}/>;
                case "multiple-choice":
                    return <Row key={rowId} row={row} type="checkbox" question={question} setSelect={setSelect}/>;
                case "single-matrix":
                    return <RowWithColumns key={rowId} row={row} type="radio" question={question} setSelect={setSelect}/>;
                default:
                    throw new Error("question type not yet supported");
            }
        });

        return (
            <div className="question">
                <div className="above-question-text"/>
                <div className="question-text">{question.text}</div>
                <div className="below-question-text"/>
                <div className="rows-container">{rowComps}</div>
            </div>
        );
    }
}

export default Question;