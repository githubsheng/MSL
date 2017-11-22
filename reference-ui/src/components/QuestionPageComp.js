import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';
import Question from './QuestionComp';

class QuestionPage extends PureComponent {
    render() {
        const {
            pageInfo,
            questions,
            setSelect,
            submitAnswersHandler
        } = this.props;

        if(!questions || questions.isEmpty()) return null;

        const questionsJSX = questions.map(question => {
            return <Question key={question.id} question={question} setSelect={setSelect}/>;
        });

        return (
            //todo: change the class name here, it should be question-page*, rather than page*
            //the extra structures, such as page-body-left, page-body-right are used by the plugins to cusomize the UI.
            <div className="page">
                <div className="page-header"></div>
                <div className="page-body">
                    <div className="page-body-left">
                    </div>
                    <div className="page-body-center">
                        {questionsJSX}
                    </div>
                    <div className="page-body-right">
                    </div>
                </div>
                <div className="page-submit-container">
                    <button onClick={submitAnswersHandler}>Submit</button>
                </div>
                <div className="page-footer"></div>
            </div>
        );
    }
}

export default QuestionPage;