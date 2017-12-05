import {Component} from "react/lib/ReactBaseClasses";
import React from 'react';
import Question from './QuestionComp';
import {pluginManager} from "../plugins/pluginManager";
import {pageUpdatedAction} from "../actions/PageActions";

class QuestionPage extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps && this.state === nextState);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.pageInfo.id !== this.props.pageInfo.id) {
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

        const pageClassName  = `question-page question-page-${pageInfo.id}`;

        return (
            //todo: change the class name here, it should be question-page*, rather than page*
            //the extra structures, such as page-body-left, page-body-right are used by the plugins to cusomize the UI.
            <div id="question-page" className={pageClassName}>
                <div id="question-page-banner" className="banner">MSL</div>
                <div id="question-page-header" className="header"/>
                <div id="question-page-body" className="body">
                    <div id="question-page-body-left" className="body-left">
                    </div>
                    <div id="question-page-body-center" className="body-center">
                        {questionsJSX}
                    </div>
                    <div id="question-page-body-right" className="body-right">
                    </div>
                </div>
                <div id="question-page-submit-container" className="submit-container">
                    <button id="question-page-submit-button" className="submit-button btn btn-primary" onClick={submitAnswersHandler}>Submit</button>
                </div>
                <div id="question-page-footer" className="footer"/>
            </div>
        );
    }
}

export default QuestionPage;