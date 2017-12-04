import {PluginImportsComp} from "../components/PluginImportsComp";
import connect from "react-redux/es/connect/connect";

function mapStateToProps(state) {
    return {
        jsPluginImports: state.jsPluginImports,
        cssPluginImports: state.cssPluginImports
    }
}

const PluginImportsContainer = connect(
    mapStateToProps
)(PluginImportsComp);

export default PluginImportsContainer;