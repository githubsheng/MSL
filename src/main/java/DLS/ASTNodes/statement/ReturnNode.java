package DLS.ASTNodes.statement;

import java.util.Optional;

/**
 * Created by wangsheng on 16/9/17.
 */
public class ReturnNode extends StatementNode {

    private final Optional<ExpressionNode> returnValue;

    public ReturnNode() {
        this.returnValue = Optional.empty();
    }

    public ReturnNode(ExpressionNode returnValue) {
        this.returnValue = Optional.of(returnValue);
    }

}
