import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';
import Question from './QuestionComp';

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

        const questionsJSX = questions.map(question => {
            return <Question key={question.id} question={question} setSelect={setSelect}/>;
        });

        return (
            //todo: change the class name here, it should be question-page*, rather than page*
            //the extra structures, such as page-body-left, page-body-right are used by the plugins to cusomize the UI.
            <div className="question-page">
                <div className="header"></div>
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
                    <button className="submit-button" onClick={submitAnswersHandler}>Submit</button>
                </div>
                <div className="footer"></div>
            </div>
        );
    }
}

export default QuestionPage;