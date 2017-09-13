package DLS.ASTNodes;

import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.statement.expression.CallNode;

/**
 * a page can be interpreted as a function definition and an immediate call of this function.
 */
public class PageNode extends Node {

    public final FuncDefNode pageFuncDef;
    public final CallNode pageFuncCall;

    public PageNode(FuncDefNode funcDefNode, CallNode callNode) {
        this.pageFuncDef = funcDefNode;
        this.pageFuncCall = callNode;
    }
}
