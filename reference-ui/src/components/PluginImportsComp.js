import {PureComponent} from "react/lib/ReactBaseClasses";
import React from 'react';

export class PluginImportsComp extends PureComponent {

    render(){
        const {jsPluginImports, cssPluginImports} = this.props;
        const jsLinks = jsPluginImports.map(url => (<script key={url} src={url}></script>));
        const cssLinks = cssPluginImports.map(url => (<link key={url} rel="stylesheet" href={url}/>));
        return (
            <div id="plugins">
                <div id="jsPluginImports">{jsLinks}</div>
                <div id="cssPluginImports">{cssLinks}</div>
            </div>
        )
    }

}