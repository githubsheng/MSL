package DLS.ASTNodes;

import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.statement.StatementNode;

import java.util.List;

public class PageGroupNode extends Node {

    public final List<FuncDefNode> funcDefNodes;
    public final List<StatementNode> statementNodes;

    public PageGroupNode(List<FuncDefNode> funcDefNodes, List<StatementNode> statementNodes) {
        this.funcDefNodes = funcDefNodes;
        this.statementNodes = statementNodes;
    }
}
