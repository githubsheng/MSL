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
import {pluginManager} from "./plugins/pluginManager";

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
        pluginManager.resetRegisteredPlugins();
        store.dispatch(resetSurveyAction(false, jsPluginImports, cssPluginImports));
    },
    reDebugSurvey: function(jsPluginImports, cssPluginImports){
        pluginManager.resetRegisteredPlugins();
        store.dispatch(resetSurveyAction(true, jsPluginImports, cssPluginImports));
    },
    dispatch: function(action){
        //we use setTimeout to make sure that the dispatch function call do not happen when we are in the middle of mainReducer..
        //in the mainReducer, we will invoke all registered plugins and pass the actions to them. they may dispatch other actions using this method.

        //dispatching an action directly inside the main reducer is considered bad practices, so we add this setTimeout to make sure whatever that gets
        //dispatched will only be dispatched when the main reducer finishing running...
        setTimeout(function(){
            store.dispatch(action);
        }, 0);
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
