import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class PluginImportsComp extends PureComponent {

    constructor(){
        super();
        this.pluginElems = [];
    }

    insertPlugins(){

        //when embedded in ide we need to reuse the RUI for different surveys...hence, we need to remove it
        //this is specially the case for stylesheet..
        //so here, we remove all the existing plugins elements (including stylesheets to reset the styles)
        this.pluginElems.forEach(pe => {
            pe.remove();
        });

        const {jsPluginImports, cssPluginImports} = this.props;
        jsPluginImports.map(url => {
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
            this.pluginElems.push(script);
        });
        cssPluginImports.map(url => {
            const fileref = document.createElement("link");
            fileref.rel = "stylesheet";
            fileref.type = "text/css";
            fileref.href = url;
            document.body.appendChild(fileref);
            this.pluginElems.push(fileref);
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