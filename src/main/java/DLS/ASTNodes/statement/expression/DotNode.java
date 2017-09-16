package DLS.ASTNodes.statement.expression;

import DLS.ASTNodes.statement.ExpressionNode;

/**
 * Created by wangsheng on 12/9/17.
 */
public class DotNode extends ExpressionNode {

    private final ExpressionNode left;
    private final ExpressionNode right;

    public DotNode(ExpressionNode left, ExpressionNode right) {
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
