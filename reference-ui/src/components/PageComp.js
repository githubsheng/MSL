import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';
import Question from './QuestionComp';

class Page extends PureComponent {
    render() {
        const {
            pageInfo,
            questions,
            submitAnswersHandler
        } = this.props;

        const questionsJSX = questions.map(question => {
            return <Question key={question.id} question={question}/>;
        });

        return (
            <div>
                <div>
                    {questionsJSX}
                </div>
                <button onClick={submitAnswersHandler}>Submit</button>
            </div>

        );
    }
}

export default Page;