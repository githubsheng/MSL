import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class Col extends PureComponent {

    render(){
        const {col, row, type, question, setSelect} = this.props;
        return (
            //using question-col instead of col because boostrap css also have col class
            <div className="question-col">
                <input type={type} checked={col.selected}
                       onClick={evt => setSelect(question.id, row.id, col.id, !col.selected)}/>
                <div className="text">{col.text}</div>
            </div>
        )

    }

}