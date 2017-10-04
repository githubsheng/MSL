package DLS.ASTNodes.statement.expression.logical;

import DLS.ASTNodes.statement.expression.ExpressionNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class NotNode extends ExpressionNode {

    private final ExpressionNode target;

    public NotNode(ExpressionNode target) {
        this.target = target;
    }

    public ExpressionNode getTarget() {
        return target;
    }
}
