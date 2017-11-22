import {submitAnswersAction, setSelectAction} from "../actions/AnswerActions";
import QuestionPage from "../components/QuestionPageComp";
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

const QuestionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(QuestionPage);

export default QuestionPageContainer;