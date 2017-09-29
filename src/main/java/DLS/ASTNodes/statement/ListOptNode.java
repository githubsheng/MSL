package DLS.ASTNodes.statement;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.expression.IdentifierNode;
import org.antlr.v4.runtime.Token;

import java.util.List;

public class ListOptNode extends StatementNode implements TokenAssociation {

    private final ListOptType optType;
    private final IdentifierNode listName;
    private final List<StatementNode> statements;
    private Token token;
    public static final IdentifierNode $index = new IdentifierNode("$index");
    public static final IdentifierNode $element = new IdentifierNode("$element");


    public ListOptNode(ListOptType optType, IdentifierNode listName, List<StatementNode> statements) {
        this.optType = optType;
        this.listName = listName;
        this.statements = statements;
    }

    public ListOptType getOptType() {
        return optType;
    }

    public IdentifierNode getListName() {
        return listName;
    }

    public List<StatementNode> getStatements() {
        return statements;
    }

    @Override
    public Token getToken() {
        return token;
    }

    @Override
    public void setToken(Token token) {
        this.token = token;
    }

    public enum ListOptType {
        LOOP, MAP, FILTER
    }

}


