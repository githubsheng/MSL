import React from 'react';
import {PureComponent} from "react/lib/ReactBaseClasses";
import QuestionPageContainer from "./containers/QuestionPageContainer";
import WelcomePageContainer from "./containers/WelcomePageContainer";

class App extends PureComponent {

    render() {
        return (
            <div>
                <WelcomePageContainer/>
                <QuestionPageContainer/>
            </div>
        );
    }
}

export default App;
