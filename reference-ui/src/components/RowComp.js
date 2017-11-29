import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import {Col} from './ColComp';
import {isPropertyValueFalse, isPropertyValueTrue, rotate, shuffle} from "../util/util";

export class Row extends PureComponent {

    render(){
        const {row, type, question, setSelect} = this.props;
        // if(row.hide === true || row.hide === "true") return null;
        if(isPropertyValueTrue(row.hide)) return null;
        // if(row.show === false || row.show === "false") return null;
        if(isPropertyValueFalse(row.show)) return null;

        return (
            //using question-row instead of row because boostrap css also have row class
            <div className="question-row">
                <input type={type} checked={row.selected}
                       onClick={evt => setSelect(question.id, row.id, null, !row.selected)}/>
                <div className="text">{row.text}</div>
            </div>
        )
    }

}

export class RowWithColumns extends PureComponent {

    render() {
        const {row, type, question, setSelect} = this.props;

        // if(row.hide === true || row.hide === "true") return null;
        if(isPropertyValueTrue(row.hide)) return null;
        // if(row.show === false || row.show === "false") return null;
        if(isPropertyValueFalse(row.show)) return null;

        const colCompsInRow = Object.entries(question.cols).map(colKV => {
            const [colId] = colKV;
            const colInRow = row[colId];
            return (
                <Col key={colId} col={colInRow} row={row} type={type} setSelect={setSelect} question={question}/>
            );
        });

        if(isPropertyValueTrue(question.randomizeCol)) shuffle(colCompsInRow);
        if(isPropertyValueTrue(question.rotateCol)) rotate(colCompsInRow);

        return (
            <div className="row-with-cols">
                <div className="row-text">{row.text}</div>
                <div className="cols-container">
                    {colCompsInRow}
                </div>
            </div>
        )
    }

}