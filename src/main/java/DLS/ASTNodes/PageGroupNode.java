package DLS.ASTNodes;

import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.statement.expression.CallNode;

import java.util.HashMap;
import java.util.Map;

public class PageGroupNode extends Node {

    public final FuncDefNode pageFuncDef;
    public final CallNode pageFuncCall;
    public static Map<String, String> implicitValues;

    {
        implicitValues = new HashMap<>();
        implicitValues.put(PageGroupAttribute.RANDOMIZE.toIdentifierName(), "true");
        implicitValues.put(PageGroupAttribute.ROTATE.toIdentifierName(), "true");
    }

    public PageGroupNode(FuncDefNode funcDefNode, CallNode callNode) {
        this.pageFuncDef = funcDefNode;
        this.pageFuncCall = callNode;

    }



}
