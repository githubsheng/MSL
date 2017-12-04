import React from 'react';
import {PureComponent} from "react/lib/ReactBaseClasses";
import QuestionPageContainer from "./containers/QuestionPageContainer";
import WelcomePageContainer from "./containers/WelcomePageContainer";
import EndPageContainer from "./containers/EndPageContainer";
import PluginImportsContainer from "./containers/PluginImportsContainer";

class App extends PureComponent {

    render() {
        return (
            <div>
                <WelcomePageContainer/>
                <QuestionPageContainer/>
                <EndPageContainer/>
                <PluginImportsContainer/>
            </div>
        );
    }
}

export default App;
