package DLS.ASTNodes.statement.declaration;

import DLS.ASTNodes.Node;
import DLS.ASTNodes.statement.expression.IdentifierNode;

/**
 * Created by wangsheng on 12/9/17.
 */
public class DefNode extends Node {

    public final IdentifierNode identifier;

    public DefNode(IdentifierNode identifier) {
        this.identifier = identifier;
    }

}
