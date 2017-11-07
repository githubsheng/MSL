import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class Question extends PureComponent {
    render (){
        console.log(this.props);
        return (<div>{this.props.question.text}</div>);
    }
}