import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import {Row, RowWithColumns} from './RowComp';
import {extractHTMLElementAttributesFromProps, isPropertyValueFalse, isPropertyValueTrue} from "../util/util";
import {pluginManager} from "../plugins/pluginManager";
import {questionLoadAction, questionUnloadAction} from "../actions/PluginActions";

class Question extends PureComponent {

    componentDidMount() {
        pluginManager.passEventsToPlugins(questionLoadAction(this.props.question, this.questionDiv));
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.props.question.id !== nextProps.question.id) {
            pluginManager.passEventsToPlugins(questionUnloadAction(this.props.question, this.questionDiv));
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.question.id !== this.props.question.id) {
            pluginManager.passEventsToPlugins(questionLoadAction(this.props.question, this.questionDiv));
        }
    }

    render() {
        const {question, setSelect} = this.props;
        // if(question.hide === true || question.hide === "true") return null;
        if (isPropertyValueTrue(question.hide)) return null;
        // if(question.show === false || question.show === "false") return null;
        if (isPropertyValueFalse(question.show)) return null;

        const questionDivProps = extractHTMLElementAttributesFromProps(question);

        let questionOptions = null;

        if(question.rowIds) {
            //don't use rowId as key, because rowId changes, so each time the row comp gets recreated (because key is different), instead of simply modified.
            //if there are 5 rows, and the new question has 10 rows, then for the first 5 rows, we can simply modify them (this is possible because keys are 1 ~5, same)
            const rowComps = question.rowIds.map((rowId, index) => {
                const row = question[rowId];
                switch (question.type) {
                    case "single-choice":
                        return <Row key={index} row={row} type="radio" question={question} setSelect={setSelect}/>;
                    case "multiple-choice":
                        return <Row key={index} row={row} type="checkbox" question={question} setSelect={setSelect}/>;
                    case "single-matrix":
                        return <RowWithColumns key={index} row={row} type="radio" question={question}
                                               setSelect={setSelect}/>;
                    case "multiple-matrix":
                        return <RowWithColumns key={index} row={row} type="checkbox" question={question}
                                               setSelect={setSelect}/>;
                    case "empty-question":
                        return undefined;
                    default:
                        throw new Error("question type not yet supported");
                }
            });

            questionOptions = (
                <div className="rows">
                    <div className="rows-left"/>
                    <div className="rows-center">{rowComps}</div>
                    <div className="rows-right"/>
                </div>
            );
        } else {
            questionOptions = (
                <div className="empty-question-space"/>
            );
        }

        return (
            <div id={question.id} className="question"
                 ref={(questionDiv) => {this.questionDiv = questionDiv;}}
                 {...questionDivProps}>
                <div className="above-question-text"/>
                <div className="question-text">{question.text || "warning: no question text"}</div>
                <div className="below-question-text"/>
                {questionOptions}
            </div>
        );
    }
}

export default Question;