package DLS.ASTNodes.statement.expression.literal;

import DLS.ASTNodes.statement.ExpressionNode;

/**
 * Created by wangsheng on 16/9/17.
 */
public final class StringNode extends ExpressionNode{

    private final String val;

    public StringNode(String val) {
        this.val = val;
    }

    public String getVal() {
        return val;
    }
}
