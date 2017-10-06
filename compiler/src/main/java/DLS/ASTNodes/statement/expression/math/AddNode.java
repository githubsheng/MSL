package DLS.ASTNodes.statement.expression.math;

import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class AddNode extends BinaryNode {
    public AddNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
