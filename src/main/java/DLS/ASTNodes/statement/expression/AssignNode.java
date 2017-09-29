package DLS.ASTNodes.statement.expression;

/**
 * Created by wangsheng on 12/9/17.
 */
public class AssignNode extends ExpressionNode {

    private final ExpressionNode target;
    private final ExpressionNode value;

    public AssignNode(ExpressionNode target, ExpressionNode value) {
        this.target = target;
        this.value = value;
    }

    public ExpressionNode getTarget() {
        return target;
    }

    public ExpressionNode getValue() {
        return value;
    }
}
