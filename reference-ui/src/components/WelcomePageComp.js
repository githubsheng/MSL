import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class WelcomePageComp extends PureComponent {

    render(){

        const {isStarted, startAnsweringHandler} = this.props;

        if(isStarted) return null;

        return (
            <div className="welcome-page">
                <div className="banner">MSL</div>
                <div className="legal-documents">
                    <div className="well">
                        <ul>
                            <li>複数のアンケート画面を同時に開くと、正常に回答できません。</li>
                            <li>アンケートはひとつずつ、回答ください。</li>
                            <li>アンケートへの回答は、「動作環境」に記載の環境からお願いします。</li>
                            <li>回答結果は、当社の「個人情報保護方針」に基づいて取り扱います。</li>
                        </ul>
                    </div>
                </div>
                <div className="start-survey-button-container">
                    <button className="start-button btn btn-success" onClick={evt => startAnsweringHandler()}>Start answering</button>
                </div>
            </div>
        )
    }

}