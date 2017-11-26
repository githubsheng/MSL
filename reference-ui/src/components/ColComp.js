import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class Col extends PureComponent {

    render(){
        const {col, row, type, question, setSelect} = this.props;
        return (
            <div className="col">
                <input type={type} checked={col.selected}
                       onClick={evt => setSelect(question.id, row.id, col.id, !col.selected)}/>
                <span className="text">{col.text}</span>
            </div>
        )

    }

}