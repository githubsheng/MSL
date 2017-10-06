package DLS.ASTNodes.statement;

import DLS.ASTNodes.Node;
import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.StatementNode;
import DLS.ASTNodes.statement.expression.IdentifierNode;
import org.antlr.v4.runtime.Token;

import java.util.Collections;
import java.util.List;

public class FuncDefNode extends StatementNode implements TokenAssociation {

    private final IdentifierNode name;
    private final List<String> argumentList;
    private final List<StatementNode> statements;
    private Token token;

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

    @Override
    public Token getToken() {
        return token;
    }

    @Override
    public void setToken(Token token) {
        this.token = token;
    }
}
