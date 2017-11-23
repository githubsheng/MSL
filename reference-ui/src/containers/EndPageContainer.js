import {EndPageComp} from "../components/EndPageComp";
import connect from "react-redux/es/connect/connect";

function mapStateToProps(state) {
    return {
        isEnded: state.isEnded
    }
}

const EndPageContainer = connect(
    mapStateToProps
)(EndPageComp);

export default EndPageContainer;