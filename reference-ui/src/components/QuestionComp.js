import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

import {Row, RowWithColumns} from './RowComp';
import {
    extractHTMLElementAttributesFromProps, isPropertyValueFalse, isPropertyValueTrue, rotate,
    shuffle
} from "../util/util";
import {pluginManager} from "../plugins/pluginManager";
import {questionChangedAction} from "../actions/PluginActions";

class Question extends PureComponent {

    componentDidMount() {
        pluginManager.passEventsToPlugins(questionChangedAction(this.props.question, this.questionDiv));
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.question !== this.props.question) {
            pluginManager.passEventsToPlugins(questionChangedAction(this.props.question, this.questionDiv));
        }
    }

    render() {

        const {question, setSelect} = this.props;

        // if(question.hide === true || question.hide === "true") return null;
        if (isPropertyValueTrue(question.hide)) return null;
        // if(question.show === false || question.show === "false") return null;
        if (isPropertyValueFalse(question.show)) return null;

        //dont use rowId as key, because rowId changes, so each time the row comp gets recreated (because key is different), instead of simply modified.
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
                default:
                    throw new Error("question type not yet supported");
            }
        });

        const questionDivProps = extractHTMLElementAttributesFromProps(question);

        return (
            <div id={question.id} className="question"
                 ref={(questionDiv) => {this.questionDiv = questionDiv;}}
                 {...questionDivProps}>
                <div className="above-question-text"/>
                <div className="question-text">{question.text}</div>
                <div className="below-question-text"/>
                <div className="rows">
                    <div className="rows-left"/>
                    <div className="rows-center">{rowComps}</div>
                    <div className="rows-right"/>
                </div>
            </div>
        );
    }
}

export default Question;