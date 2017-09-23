package DLS.ASTNodes.statement.expression;

/**
 * Created by sheng.wang on 2017/09/13.
 */

import DLS.ASTNodes.statement.ExpressionNode;

import java.util.Collections;
import java.util.List;

/**
 * this node stands for a function call or a method call.
 */
public class CallNode extends ExpressionNode {

    private final ExpressionNode thisArg;
    private final IdentifierNode funcName;
    private final List<ExpressionNode> arguments;


    public CallNode(IdentifierNode funcName) {
        this(funcName, Collections.emptyList());
    }

    public CallNode(IdentifierNode funcName, List<ExpressionNode> arguments) {
        this(null, funcName, arguments);
    }

    public CallNode(ExpressionNode thisArg, IdentifierNode funcName) {
        this(thisArg, funcName, Collections.emptyList());
    }

    public CallNode(ExpressionNode thisArg, IdentifierNode funcName, List<ExpressionNode> arguments) {
        this.thisArg = thisArg;
        this.funcName = funcName;
        this.arguments = arguments;
    }

    public ExpressionNode getThisArg() {
        return thisArg;
    }

    public ExpressionNode getFuncName() {
        return funcName;
    }

    public List<ExpressionNode> getArguments() {
        return arguments;
    }
}