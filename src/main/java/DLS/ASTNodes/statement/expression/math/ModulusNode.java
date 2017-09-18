package DLS.ASTNodes.statement.expression.math;

import DLS.ASTNodes.statement.ExpressionNode;
import DLS.ASTNodes.statement.expression.BinaryNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class ModulusNode extends BinaryNode {
    public ModulusNode(ExpressionNode left, ExpressionNode right) {
        super(left, right);
    }
}
