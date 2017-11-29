import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';
import {isPropertyValueFalse, isPropertyValueTrue} from "../util/util";

export class Col extends PureComponent {

    render(){
        const {col, row, type, question, setSelect} = this.props;

        // if(col.hide === true || col.hide === "true") return null;
        if(isPropertyValueTrue(col.hide)) return null;
        // if(col.show === false || col.show === "false") return null;
        if(isPropertyValueFalse(col.show)) return null;

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