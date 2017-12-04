import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class PluginImportsComp extends PureComponent {

    insertPlugins(){
        const {jsPluginImports, cssPluginImports} = this.props;
        jsPluginImports.map(url => {
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
        });
        cssPluginImports.map(url => {
            const fileref = document.createElement("link");
            fileref.rel = "stylesheet";
            fileref.type = "text/css";
            fileref.href = url;
            document.body.appendChild(fileref)
        });
    }

    //not called in initial rendering
    componentDidUpdate() {
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