package DLS.ASTNodes.statement.expression.math;

import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class MultiplyNode extends BinaryNode {
    public MultiplyNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
