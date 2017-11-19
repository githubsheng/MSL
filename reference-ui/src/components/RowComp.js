/**
 * Created by wangsheng on 17/11/17.
 */

import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

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