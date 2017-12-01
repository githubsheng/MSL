import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';
import Question from './QuestionComp';
import {isPropertyValueTrue, rotate, shuffle} from "../util/util";

class QuestionPage extends PureComponent {
    render() {
        const {
            pageInfo,
            questions,
            setSelect,
            submitAnswersHandler,
            isStarted,
            isEnded
        } = this.props;

        if(!isStarted || isEnded) return null;

        const questionsJSX = questions.map((question, index) => {
            return <Question key={index} question={question} setSelect={setSelect}/>;
        });

        return (
            //todo: change the class name here, it should be question-page*, rather than page*
            //the extra structures, such as page-body-left, page-body-right are used by the plugins to cusomize the UI.
            <div className="question-page">
                <div className="banner">MSL</div>
                <div className="header"/>
                <div className="body">
                    <div className="body-left">
                    </div>
                    <div className="body-center">
                        {questionsJSX}
                    </div>
                    <div className="body-right">
                    </div>
                </div>
                <div className="submit-container">
                    <button className="submit-button btn btn-primary" onClick={submitAnswersHandler}>Submit</button>
                </div>
                <div className="footer"/>
            </div>
        );
    }
}

export default QuestionPage;