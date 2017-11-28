import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class EndPageComp extends PureComponent {

    render(){

        const {isEnded} = this.props;

        if(!isEnded) return null;

        return (
            <div className="end-survey-page">
                <div className="banner">MSL</div>
                <div className="thank-you-message">
                    <p className="well">
                        Thank you for taking the survey, have a nice day!
                    </p>
                </div>
            </div>
        )
    }

}