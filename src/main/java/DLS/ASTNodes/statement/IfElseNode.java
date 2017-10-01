package DLS.ASTNodes.statement;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.expression.ExpressionNode;
import org.antlr.v4.runtime.Token;

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

    public List<Branch> getBranches() {
        return branches;
    }

    public static final class Branch implements TokenAssociation {
        public final ExpressionNode condition;
        public final List<StatementNode> statements;
        private Token token;

        public Branch(ExpressionNode condition, List<StatementNode> statements) {
            this.condition = condition;
            this.statements = statements;
        }

        /**
         * here the token is the token associated with the condition.
         * the statements inside the branch will have their own associated tokens.
         * @return the token associated with the condition of the branch
         */
        @Override
        public Token getToken() {
            return token;
        }

        /**
         * associate a token with the condition inside the branch.
         * the statements inside the branch will have their own associated tokens.
         * @param token token to be associated with the condition.
         */
        @Override
        public void setToken(Token token) {
            this.token = token;
        }
    }

}
