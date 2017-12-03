package DLS.ASTNodes.plugin;

import DLS.ASTNodes.statement.StatementNode;

//it doesn't look like a statement though, but the ParseTreeVisitor needs to return a list of statement node, so
//we make it a statement node here...
public class CssPluginNode extends StatementNode {
    public final String url;

    public CssPluginNode(String url) {
        this.url = url;
    }
}
