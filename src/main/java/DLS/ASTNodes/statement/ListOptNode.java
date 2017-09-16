package DLS.ASTNodes.statement;

import DLS.ASTNodes.statement.expression.IdentifierNode;
import java.util.List;

public class ListOptNode extends StatementNode {

    private final ListOptType optType;
    private final IdentifierNode listName;
    private final List<StatementNode> statements;
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

    public enum ListOptType {
        LOOP, MAP, FILTER
    }

}


