package DLS.ASTNodes.statement.built.in.commands;

import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.ASTNodes.statement.StatementNode;
import java.util.List;

public class SendDataNode extends StatementNode {
    private final List<? extends ExpressionNode> data;

    public SendDataNode(List<? extends ExpressionNode> data) {
        this.data = data;
    }

    public List<? extends ExpressionNode> getData() {
        return data;
    }
}
