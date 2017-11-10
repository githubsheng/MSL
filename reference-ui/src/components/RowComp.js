/**
 * Created by wangsheng on 17/11/17.
 */

import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

class Row extends PureComponent {

    render(){
        const {row} = this.props;
        console.log(row);
        return (
            <div>{row.text}</div>
        )

    }

}

export default Row;