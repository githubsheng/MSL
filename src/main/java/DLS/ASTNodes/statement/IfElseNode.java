package DLS.ASTNodes.statement;

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

    public static final class Branch {
        public final ExpressionNode condition;
        public final List<StatementNode> statements;

        public Branch(ExpressionNode condition, List<StatementNode> statements) {
            this.condition = condition;
            this.statements = statements;
        }
    }

}
