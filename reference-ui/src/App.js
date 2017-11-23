import React from 'react';
import {PureComponent} from "react/lib/ReactBaseClasses";
import QuestionPageContainer from "./containers/QuestionPageContainer";
import WelcomePageContainer from "./containers/WelcomePageContainer";
import EndPageContainer from "./containers/EndPageContainer";

class App extends PureComponent {

    render() {
        return (
            <div>
                <WelcomePageContainer/>
                <QuestionPageContainer/>
                <EndPageContainer/>

            </div>
        );
    }
}

export default App;
