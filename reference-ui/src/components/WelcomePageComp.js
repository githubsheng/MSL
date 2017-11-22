import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class WelcomePageComp extends PureComponent {

    render(){

        const {isStarted, startAnsweringHandler} = this.props;

        if(isStarted) return null;

        return (
            <div>
                Welcome Page
                <div>
                    <button onClick={evt => startAnsweringHandler()}>Start answering</button>
                </div>
            </div>
        )
    }

}