package DLS.ASTNodes;

import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.statement.StatementNode;

import java.util.List;

/**
 * Created by wangsheng on 12/9/17.
 */
public class FileNode extends Node {

    public final List<StatementNode> statements;

    /**
     *
     * @param statements A list of nodes. A node can only be PageNode or a PageGroupNode
     */
    public FileNode(List<StatementNode> statements) {
        //todo: validation of the node type here.
        this.statements = statements;
    }

}
