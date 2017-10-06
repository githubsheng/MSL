package DLS.ASTNodes.statement.expression;

public class AssignNode extends ExpressionNode {

    private final ExpressionNode target;
    private final ExpressionNode value;

    public AssignNode(ExpressionNode target, ExpressionNode value) {
        this.target = target;
        this.value = value;
        if(!(this.target instanceof DotNode)
                && !(this.target instanceof IdentifierNode))
            throw new RuntimeException("");
    }

    public ExpressionNode getTarget() {
        return target;
    }

    public ExpressionNode getValue() {
        return value;
    }
}
