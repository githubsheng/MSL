package DLS.ASTNodes.statement.expression.relational;

import DLS.ASTNodes.statement.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 10/9/17.
 */
public class MoreThanNode extends BinaryNode {
    public MoreThanNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
