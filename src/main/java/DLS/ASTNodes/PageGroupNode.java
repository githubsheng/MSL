package DLS.ASTNodes;

import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.statement.expression.CallNode;

public class PageGroupNode extends Node {

    public final FuncDefNode pageGroupFuncDef;
    public final CallNode pageGroupFuncCall;

    public PageGroupNode(FuncDefNode funcGroupDefNode, CallNode callNode) {
        this.pageGroupFuncDef = funcGroupDefNode;
        this.pageGroupFuncCall = callNode;

    }



}
