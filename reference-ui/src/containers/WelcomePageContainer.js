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
        //todo: allow debugging
        //todo: right now we set isDebug to be always false
        dispatch(startAnsweringAction(false))
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