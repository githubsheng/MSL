import {Component, PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class PluginImportsComp extends Component {

    constructor(){
        super();
        this.thirdPartyJsLibs = new Set();
    }

    insertPlugins(){
        /*
            when embedded in ide we need to reuse the RUI for different surveys...hence, we need to remove the plugin stylesheets when we re-run the survey, otherwise
            stylesheets introduced in previous surveys may have (unwanted) effect on the current surveys.
            so here, we remove all the existing plugins stylesheets (including stylesheets to reset the styles)
            however, when it comes to plugin js, things are a bit trickier.
            we make sure all registered callbacks are unregistered, when we run a new survey, js plugins registered for the previous surveys
            won't be called. This is done by pluginManager.resetRegisteredPlugins() function.
            if a plugin is well written, it should not pollute global namespace, and has no effect as long as it is not called by plugin manager( in the above case, it won't
            be called, because we would have unregistered it when we run a new survey).
            but some 3rd party libraries will probably make changes to global namespaces, keep working without being called, or reacts to various events.
            there is no obvious way to overcome this. when you import a piece of 3rd party js, it just runs, you cannot undo all the side effects.
            so here, the least we can do is, to make sure a 3rd party library is not ran multiple times. For instance, when we introduce google map for the current survey,
            and later a new survey also want to import google map api, we can ignore the second import, because it has already been imported (and cannot be removed, at least
            no official doc says anything about removing).

            we use this component to remember what 3rd party js links have been imported because this component will keep living once it is created. and we make sure no 3rd party js links are imported twice.

            so in summary,
            we remove css and add them back if needed.
            when a plugin is not needed, we remove its js link tag. this has no effects, just trying to make the dom looks nicer. we also unregister it from pluginManager.
            when a plugin is needed again, a js link tag is appended to dom, causing the plugin code to run again, the plugin code, when running, should register itself in pluginManager.
            we make sure no 3rd party libraries are added twice, but we don't remove them / undo their effects /remove their js link tag.
         */
        const previousPlugins = document.querySelectorAll('body > link[data-plugin="true"]');
        previousPlugins.forEach(pp => {
            pp.remove();
        });

        const {jsPluginImports, cssPluginImports} = this.props;
        jsPluginImports
        //make sure 3rd party lib is not loaded twice.
            .filter(url => !this.thirdPartyJsLibs.has(url))
            .map(url => {
                const script = document.createElement("script");
                script.src = url;
                script.async = true;
                script.dataset.plugin = "true";
                document.body.appendChild(script);
                if(!url.includes("msl_plugins_repo")) {
                    //has to be a 3rd party lib
                    this.thirdPartyJsLibs.add(url);
                }

        });
        cssPluginImports.map(url => {
            const fileref = document.createElement("link");
            fileref.rel = "stylesheet";
            fileref.type = "text/css";
            fileref.href = url;
            fileref.dataset.plugin = "true";
            document.body.appendChild(fileref);
        });
    }

    componentDidUpdate () {
        this.insertPlugins();
    }

    //called in initial rendering
    componentDidMount () {
        this.insertPlugins();
    }

    render(){
        return (
            //well, this is just a marker.
            <div id="plugins"/>
        )
    }

}