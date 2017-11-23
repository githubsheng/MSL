import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class WelcomePageComp extends PureComponent {

    render(){

        const {isStarted, startAnsweringHandler} = this.props;

        if(isStarted) return null;

        return (
            <div className="welcome-page">
                <div className="legal-documents">legal documents</div>
                <div className="start-survey-button-container">
                    <button className="start-button" onClick={evt => startAnsweringHandler()}>Start answering</button>
                </div>
            </div>
        )
    }

}