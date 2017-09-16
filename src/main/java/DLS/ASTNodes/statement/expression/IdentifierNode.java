package DLS.ASTNodes.statement.expression;

import DLS.ASTNodes.statement.ExpressionNode;

/**
 * Created by wangsheng on 12/9/17.
 */
public class IdentifierNode extends ExpressionNode {

    public final String name;

    public IdentifierNode(String name) {
        this.name = name;
    }
}
