package DLS.ASTNodes.statement.expression.logical;

import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class NotEqualsNode extends BinaryNode {
    public NotEqualsNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
