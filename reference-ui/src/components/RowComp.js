import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import {Col} from './ColComp';

export class Row extends PureComponent {

    render(){
        const {row, type, question, setSelect} = this.props;
        return (
            <div className="row">
                <input type={type} checked={row.selected}
                       onClick={evt => setSelect(question.id, row.id, null, !row.selected)}/>
                <span className="text">{row.text}</span>
            </div>
        )
    }

}

export class RowWithColumns extends PureComponent {

    render() {
        const {row, type, question, setSelect} = this.props;
        const colCompsInRow = Object.entries(question.cols).map(colKV => {
            const [colId] = colKV;
            const colInRow = row[colId];
            return (
                <Col key={colId} col={colInRow} row={row} type={type} setSelect={setSelect} question={question}/>
            );
        });
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