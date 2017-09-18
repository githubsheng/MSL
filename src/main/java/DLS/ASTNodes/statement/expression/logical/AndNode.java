package DLS.ASTNodes.statement.expression.logical;

import DLS.ASTNodes.statement.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class AndNode extends BinaryNode {
    public AndNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
