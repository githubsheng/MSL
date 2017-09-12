package DLS.ASTNodes.function.declaration;

import DLS.ASTNodes.Node;
import DLS.ASTNodes.statement.StatementNode;
import DLS.ASTNodes.statement.expression.IdentifierNode;

import java.util.List;

/**
 * Created by wangsheng on 12/9/17.
 */
public class FuncDefNode extends Node {

    public final IdentifierNode name;
    public final List<StatementNode> statements;

    public FuncDefNode(List<StatementNode> statements) {
        //todo: for anonymous functions we would give a random name identifier instead.
        this.name = null;
        this.statements = statements;
    }

    public FuncDefNode(IdentifierNode name, List<StatementNode> statements) {
        this.name = name;
        this.statements = statements;
    }
}
