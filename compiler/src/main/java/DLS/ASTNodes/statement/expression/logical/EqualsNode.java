package DLS.ASTNodes.statement.expression.logical;

import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class EqualsNode extends BinaryNode {
    public EqualsNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
