import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import Row from './RowComp';

class Question extends PureComponent {
    render (){

        const {question} = this.props;
        const rowComps = Object.entries(question.rows).map(rowKV => {
            const [rowId, row] = rowKV;
            return <Row key={rowId} row={row}/>
        });

        return (
            <div>
                <div>{question.text}</div>
                <div>{rowComps}</div>
            </div>
        );
    }
}

export default Question;