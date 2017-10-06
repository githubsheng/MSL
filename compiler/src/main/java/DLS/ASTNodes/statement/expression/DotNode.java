package DLS.ASTNodes.statement.expression;

/**
 * Created by wangsheng on 12/9/17.
 */
public class DotNode extends ExpressionNode {

    private final ExpressionNode left;
    private final IdentifierNode right;

    public DotNode(ExpressionNode left, IdentifierNode right) {
        this.left = left;
        this.right = right;
    }

    public DotNode(ExpressionNode left, String right) {
        this(left, new IdentifierNode(right));
    }

    public ExpressionNode getLeft() {
        return left;
    }

    public IdentifierNode getRight() {
        return right;
    }
}
