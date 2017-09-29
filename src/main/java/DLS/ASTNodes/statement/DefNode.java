package DLS.ASTNodes.statement;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.expression.IdentifierNode;
import org.antlr.v4.runtime.Token;

import java.util.Optional;


/**
 * in some places we split the parser rule variableStatement into two statements:
 * 1. defines the variable.
 * 2. assign the variable a value.
 * but it does not make the code look better and does not make it much easier to generate vm commands when
 * we later walk the AST. So we decided to add a new field 'initializer' to this node and in the code commited
 * later, parser rule variable corresponds to a single DefNode (with initializer).
 */
public class DefNode extends StatementNode {

    private final boolean global;
    private final IdentifierNode identifier;
    private final Optional<ExpressionNode> initializer;


    public DefNode(String identifierName, ExpressionNode initializer) {
        this(false, new IdentifierNode(identifierName), initializer);
    }

    public DefNode(boolean global, String identifierName, ExpressionNode initializer) {
        this(global, new IdentifierNode(identifierName), initializer);
    }

    public DefNode(IdentifierNode identifier, ExpressionNode initializer) {
        this(false, identifier, initializer);
    }

    public DefNode(boolean global, IdentifierNode identifier, ExpressionNode initializer) {
        this.global = global;
        this.identifier = identifier;
        this.initializer = Optional.ofNullable(initializer);
    }

    public IdentifierNode getIdentifier() {
        return identifier;
    }

    public Optional<ExpressionNode> getInitializer() {
        return initializer;
    }

    public boolean isGlobal() {
        return global;
    }
}
