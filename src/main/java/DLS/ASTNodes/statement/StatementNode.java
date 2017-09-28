package DLS.ASTNodes.statement;

import DLS.ASTNodes.Node;
import org.antlr.v4.runtime.Token;

/**
 * StatementNode and Node can be the same class...
 * This needs refactoring
 */
public class StatementNode extends Node {
    public StatementNode(Token token) {
        super(token);
    }
}
