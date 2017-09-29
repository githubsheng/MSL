package DLS.ASTNodes.statement;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.expression.ExpressionNode;
import org.antlr.v4.runtime.Token;

public class ExpressionStatementNode extends StatementNode implements TokenAssociation {

    private final ExpressionNode exp;
    private Token token;

    public ExpressionStatementNode(ExpressionNode exp) {
        this.exp = exp;
    }

    @Override
    public Token getToken() {
        return token;
    }

    @Override
    public void setToken(Token token) {
        this.token = token;
    }
}
