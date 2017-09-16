package DLS.ASTNodes.statement.expression.logical;

import DLS.ASTNodes.statement.ExpressionNode;

/**
 * Created by wangsheng on 16/9/17.
 */
public class BinaryLogicalNode extends ExpressionNode {

    private final OperatorType operator;
    private final ExpressionNode left;
    private final ExpressionNode right;

    public BinaryLogicalNode(OperatorType operator, ExpressionNode left, ExpressionNode right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    public ExpressionNode getLeft() {
        return left;
    }

    public ExpressionNode getRight() {
        return right;
    }

    public enum OperatorType {
        AND, OR, EQUALS, NOT_EQUALS
    }

}
