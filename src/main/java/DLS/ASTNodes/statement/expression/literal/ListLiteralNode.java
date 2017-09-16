package DLS.ASTNodes.statement.expression.literal;

import DLS.ASTNodes.statement.ExpressionNode;

import java.util.List;

public class ListLiteralNode extends ExpressionNode {

    private final List<? extends ExpressionNode> elements;

    public ListLiteralNode(List<? extends ExpressionNode> elements) {
        this.elements = elements;
    }

    public List<? extends ExpressionNode> getElements() {
        return elements;
    }
}
