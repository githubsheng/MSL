import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import {Row, RowWithColumns} from './RowComp';
import {isPropertyValueFalse, isPropertyValueTrue, rotate, shuffle} from "../util/util";

class Question extends PureComponent {
    render (){

        const {question, setSelect} = this.props;

        // if(question.hide === true || question.hide === "true") return null;
        if(isPropertyValueTrue(question.hide)) return null;
        // if(question.show === false || question.show === "false") return null;
        if(isPropertyValueFalse(question.show)) return null;

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

        if(isPropertyValueTrue(question.randomize)) shuffle(rowComps);
        if(isPropertyValueTrue(question.rotate)) rotate(rowComps);

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