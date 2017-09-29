package DLS.ASTNodes.statement.built.in.commands;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.StatementNode;
import org.antlr.v4.runtime.Token;

public class EndSurveyNode extends StatementNode implements TokenAssociation {

    private Token token;

    @Override
    public Token getToken() {
        return token;
    }

    @Override
    public void setToken(Token token) {
        this.token = token;
    }
}
