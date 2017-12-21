import {Component} from "react/lib/ReactBaseClasses";
import React from 'react';
import Question from './QuestionComp';
import {pluginManager} from "../plugins/pluginManager";
import {extractHTMLElementAttributesFromProps} from "../util/util";
import {pageLoadAction, pageUnloadAction} from "../actions/PluginActions";

class QuestionPage extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps && this.state === nextState);
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.props.pageInfo.id !== nextProps.pageInfo.id) {
            pluginManager.passEventsToPlugins(pageUnloadAction(this.props.pageGroupInfo, this.props.pageInfo, this.props.questions, this.questionPageDiv));
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.pageInfo.id !== this.props.pageInfo.id) {
            pluginManager.passEventsToPlugins(pageLoadAction(this.props.pageGroupInfo, this.props.pageInfo, this.props.questions, this.questionPageDiv));
        }
        console.log(Date.now())
    }

    componentDidMount() {
        const {pageGroupInfo, pageInfo, questions} = this.props;
        pluginManager.passEventsToPlugins(pageLoadAction(pageGroupInfo, pageInfo, questions, this.questionPageDiv))
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

        const pageDivProps = extractHTMLElementAttributesFromProps(pageInfo);

        return (
            //the extra structures, such as page-body-left, page-body-right are used by the plugins to cusomize the UI.
            <div id="question-page" className="question-page" {...pageDivProps} ref={(questionPageDiv) => {this.questionPageDiv = questionPageDiv;}}>
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