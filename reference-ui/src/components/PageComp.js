import {PureComponent} from "react/lib/ReactBaseClasses";
import {Question} from "./QuestionComp";
import React from 'react';

class Page extends PureComponent {
    render() {
        const {
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