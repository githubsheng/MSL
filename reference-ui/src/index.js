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
import "./styles/css/bootstrap.css";
import "./styles/css/msl.css";

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

window.referenceUIController = {
    reRunSurvey: function(jsPluginImports, cssPluginImports){
        store.dispatch(resetSurveyAction(false, jsPluginImports, cssPluginImports));
    },
    reDebugSurvey: function(jsPluginImports, cssPluginImports){
        store.dispatch(resetSurveyAction(true, jsPluginImports, cssPluginImports));
    },
    dispatch: function(action){
        store.dispatch(action);
    }
};

const rootElementId = window.isDev ? "root" : "reference-ui";

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById(rootElementId)
);

// registerServiceWorker();
