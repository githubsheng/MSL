import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';
import Question from './QuestionComp';
import {isPropertyValueTrue, rotate, shuffle} from "../util/util";
import {pluginManager} from "../plugins/pluginManager";
import {pageUpdatedAction} from "../actions/PageActions";

class QuestionPage extends PureComponent {

    componentDidUpdate(){
        /*
            every time this.props change the component will update,
            there will be two updates before we see the first page,
            first one is `isStarted` changes from false to true,
            second one is `questions` changes to from empty to with questions.
            only when `isStarted` is true and `questions` is not empty, can we
            know that the page is rendered with questions.
         */
        if(this.props.isStarted && !this.props.questions.isEmpty()){
            //page rendered (again)
            const {pageGroupInfo, pageInfo, questions} = this.props;
            pluginManager.passEventsToPlugins(new pageUpdatedAction(pageGroupInfo, pageInfo, questions));
        }
    }

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