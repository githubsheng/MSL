package DLS.ASTNodes.statement.expression.math;

import DLS.ASTNodes.statement.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class DivideNode extends BinaryNode {
    public DivideNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
