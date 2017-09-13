package DLS.ASTNodes.statement;

import DLS.ASTNodes.statement.expression.ExpressionNode;

import java.util.Collections;
import java.util.List;

public class IfElseNode extends StatementNode {

    private final List<Branch> branches;

    public IfElseNode(ExpressionNode condition, StatementNode statement) {
        List<StatementNode> statements = Collections.singletonList(statement);
        this.branches = Collections.singletonList(new Branch(condition, statements));
    }

    public IfElseNode(ExpressionNode condition, List<StatementNode> statements) {
        this.branches = Collections.singletonList(new Branch(condition, statements));
    }

    public IfElseNode(List<Branch> branches) {
        this.branches = branches;
    }

    static final class Branch {
        final ExpressionNode condition;
        final List<StatementNode> statements;

        Branch(ExpressionNode condition, List<StatementNode> statements) {
            this.condition = condition;
            this.statements = statements;
        }
    }

}
