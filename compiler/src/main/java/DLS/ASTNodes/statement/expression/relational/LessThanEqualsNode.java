package DLS.ASTNodes.statement.expression.relational;

import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 10/9/17.
 */
public class LessThanEqualsNode extends BinaryNode {
    public LessThanEqualsNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
