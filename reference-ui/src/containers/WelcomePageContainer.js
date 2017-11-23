import {startAnsweringAction} from "../actions/FlowActions";
import {WelcomePageComp} from "../components/WelcomePageComp";
import connect from "react-redux/es/connect/connect";

function mapStateToProps(state) {
    return {
        isStarted: state.isStarted
    }
}

function mapDispatchToProps(dispatch) {

    function startAnsweringHandler(){
        dispatch(startAnsweringAction())
    }

    return {
        startAnsweringHandler
    }
}

const WelcomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WelcomePageComp);

export default WelcomePageContainer;