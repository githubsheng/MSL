package DLS.ASTNodes.statement.expression.relational;

import DLS.ASTNodes.statement.expression.ExpressionNode;

/**
 * Created by wangsheng on 12/9/17.
 */
public class EqualsNode extends ExpressionNode {

    private final ExpressionNode left;
    private final ExpressionNode right;

    public EqualsNode(ExpressionNode left, ExpressionNode right) {
        this.left = left;
        this.right = right;
    }

    public ExpressionNode getLeft() {
        return left;
    }

    public ExpressionNode getRight() {
        return right;
    }
}
