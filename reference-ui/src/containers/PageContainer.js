import {submitAnswersAction, setSelectAction} from "../actions/AnswerActions";
import Page from "../components/PageComp";
import connect from "react-redux/es/connect/connect";

function mapStateToProps(state) {
    return {
        pageInfo: state.pageInfo,
        questions: state.questions
    }
}

function mapDispatchToProps(dispatch) {

    //todo: handlers for selecting rows / cols
    function setSelect(questionId, rowId, colId, val) {
        dispatch(setSelectAction(questionId, rowId, colId, val));
    }

    function submitAnswersHandler() {
        dispatch(submitAnswersAction())
    }

    return {
        submitAnswersHandler,
        setSelect
    }
}

const PageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);

export default PageContainer;