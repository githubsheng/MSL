package DLS.ASTNodes.function.declaration;

import DLS.ASTNodes.Node;
import DLS.ASTNodes.statement.StatementNode;
import DLS.ASTNodes.statement.expression.IdentifierNode;

import java.util.Collections;
import java.util.List;

/**
 * Created by wangsheng on 12/9/17.
 */
public class FuncDefNode extends StatementNode {

    private final IdentifierNode name;
    private final List<String> argumentList;
    private final List<StatementNode> statements;

    public FuncDefNode(IdentifierNode name, List<StatementNode> statements) {
        this(name, Collections.emptyList(), statements);
    }

    public FuncDefNode(IdentifierNode name, List<String> argumentList, List<StatementNode> statements) {
        this.name = name;
        this.statements = statements;
        this.argumentList = argumentList;
    }

    public IdentifierNode getName() {
        return name;
    }

    public List<StatementNode> getStatements() {
        return statements;
    }

    public List<String> getArgumentList() {
        return argumentList;
    }
}
