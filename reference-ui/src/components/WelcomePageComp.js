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
                    <p className="well">
                        複数のアンケート画面を同時に開くと、正常に回答できません。<br/>
                        アンケートはひとつずつ、回答ください。<br/>
                        アンケートへの回答は、「動作環境」に記載の環境からお願いします。<br/>
                        本アンケートは、回答を中断してから1時間以内は中断した質問から再開可能です。<br/>
                        （システム緊急対応等により再開できない場合もありますので、予めご了承ください。）
                        回答結果は、当社の「個人情報保護方針」に基づいて取り扱います。<br/>
                    </p>
                </div>
                <div className="start-survey-button-container">
                    <button className="start-button btn btn-success" onClick={evt => startAnsweringHandler()}>Start answering</button>
                </div>
            </div>
        )
    }

}