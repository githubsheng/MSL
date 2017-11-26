import React from 'react';
import ReactDOM from 'react-dom';
import Provider from "react-redux/es/components/Provider";
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import asyncDispatchMiddleware from "./middleware/AsyncDispatchMiddleware";
import registerServiceWorker from './registerServiceWorker';

import App from './App';
import mainReducer from "./reducers/MainReducer";
import {resetSurveyAction} from "./actions/FlowActions";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    mainReducer,
    // null,
    composeEnhancers(
        applyMiddleware(
            thunkMiddleware,
            asyncDispatchMiddleware
        )
    )
);

window.referenceUIController = {};

window.referenceUIController.reRunSurvey = function(){
    store.dispatch(resetSurveyAction());
};

window.referenceUIController.reDebugSurvey = function(){
    store.dispatch(resetSurveyAction(true));
};

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('reference-ui')
);

// registerServiceWorker();
