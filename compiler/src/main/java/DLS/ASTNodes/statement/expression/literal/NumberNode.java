package DLS.ASTNodes.statement.expression.literal;

import DLS.ASTNodes.statement.expression.ExpressionNode;

/**
 * Created by wangsheng on 17/9/17.
 */
public class NumberNode extends ExpressionNode {

    private final double decimal;

    public NumberNode(double decimal) {
        this.decimal = decimal;
    }

    public double getDecimal() {
        return decimal;
    }
}
