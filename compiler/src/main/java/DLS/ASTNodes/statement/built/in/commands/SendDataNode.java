package DLS.ASTNodes.statement.built.in.commands;

import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.ASTNodes.statement.StatementNode;
import DLS.ASTNodes.statement.expression.IdentifierNode;

import java.util.List;

public class SendDataNode extends StatementNode {
    private final List<IdentifierNode> data;

    public SendDataNode(List<IdentifierNode> data) {
        this.data = data;
    }

    public List<IdentifierNode> getData() {
        return data;
    }
}
