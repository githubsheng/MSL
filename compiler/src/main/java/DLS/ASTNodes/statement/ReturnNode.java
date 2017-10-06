package DLS.ASTNodes.statement;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.expression.ExpressionNode;
import org.antlr.v4.runtime.Token;

import java.util.Optional;

/**
 * Created by wangsheng on 16/9/17.
 */
public class ReturnNode extends StatementNode implements TokenAssociation {

    private final Optional<ExpressionNode> returnValue;
    private Token token;

    public ReturnNode() {
        this.returnValue = Optional.empty();
    }

    public ReturnNode(ExpressionNode returnValue) {
        this.returnValue = Optional.of(returnValue);
    }

    public Optional<ExpressionNode> getReturnValue() {
        return returnValue;
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
