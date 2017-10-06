package DLS.ASTNodes.statement.expression;

/**
 * Created by wangsheng on 17/9/17.
 */
public class BinaryNode extends ExpressionNode {

    private final ExpressionNode left;
    private final ExpressionNode right;

    public BinaryNode(ExpressionNode left, ExpressionNode right) {
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
