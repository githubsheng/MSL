import {submitAnswersAction, setSelectAction} from "../actions/AnswerActions";
import QuestionPage from "../components/QuestionPageComp";
import connect from "react-redux/es/connect/connect";

function mapStateToProps(state) {
    return {
        pageInfo: state.pageInfo,
        questions: state.questions,
        isStarted: state.isStarted,
        isEnded: state.isEnded
    }
}

function mapDispatchToProps(dispatch) {

    function setSelect(questionId, rowId, colId, val) {
        dispatch(setSelectAction(questionId, rowId, colId, val));
    }

    function submitAnswersHandler() {
        console.log(Date.now());
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