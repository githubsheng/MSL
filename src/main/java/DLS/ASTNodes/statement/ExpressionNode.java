package DLS.ASTNodes.statement;

/**
 * Expression node is kind of special in that sometimes it is a statement, and sometimes a single expression
 * You can see in the parser rule (DLSParser.g4) that the only difference from rule expressionStatement and rule
 * expression is that single eos.
 */
public class ExpressionNode extends StatementNode {
}
