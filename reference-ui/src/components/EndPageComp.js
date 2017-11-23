import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class EndPageComp extends PureComponent {

    render(){

        const {isEnded} = this.props;

        if(!isEnded) return null;

        return (
            <div className="end-survey-page">
                <div className="thank-you-message">
                    Thank you for taking the survey, have a nice day!
                </div>
            </div>
        )
    }

}