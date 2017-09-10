package DLS;

import DLS.ASTNodes.AdditiveNode;
import DLS.ASTNodes.AssignmentNode;
import DLS.ASTNodes.Node;
import DLS.generated.DLSParser;
import DLS.generated.DLSParserBaseVisitor;
import DLS.generated.DLSParserVisitor;
import org.antlr.v4.runtime.tree.ErrorNode;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.RuleNode;
import org.antlr.v4.runtime.tree.TerminalNode;

/**
 * Created by wangsheng on 10/9/17.
 */

//todo: this is just a test.
public class ParseTreeVisitor extends DLSParserBaseVisitor<Node> {

    @Override
    public Node visitFile(DLSParser.FileContext ctx) {
        return visitPageGroup(ctx.pageGroup(0));
    }

    @Override
    public Node visitPageGroup(DLSParser.PageGroupContext ctx) {
        return visitPage(ctx.page(0));
    }

    @Override
    public Node visitPage(DLSParser.PageContext ctx) {
        return visitScript(ctx.script(0));
    }

    @Override
    public Node visitScript(DLSParser.ScriptContext ctx) {
        return visitStatement(ctx.statement(1));
    }

    @Override
    public Node visitStatement(DLSParser.StatementContext ctx) {
        return visitExpressionStatement(ctx.expressionStatement());
    }

    @Override
    public Node visitExpressionStatement(DLSParser.ExpressionStatementContext ctx) {
        return visitAssignmentExpression((DLSParser.AssignmentExpressionContext)ctx.expression());
    }


    @Override
    public Node visitAdditiveExpression(DLSParser.AdditiveExpressionContext ctx) {
        String left = ((DLSParser.IdentifierExpressionContext)ctx.expression(0)).Identifier().getText();
        String right = ((DLSParser.IdentifierExpressionContext)ctx.expression(0)).Identifier().getText();
        return new AdditiveNode(left, right);
    }


    @Override
    public Node visitAssignmentExpression(DLSParser.AssignmentExpressionContext ctx) {
        DLSParser.IdentifierExpressionContext identifierCtx = (DLSParser.IdentifierExpressionContext)ctx.expression(0);
        String target = identifierCtx.Identifier().getText();

        DLSParser.AdditiveExpressionContext additiveExpCtx = (DLSParser.AdditiveExpressionContext)ctx.expression(1);
        Node node = visitAdditiveExpression(additiveExpCtx);
        return new AssignmentNode(target, node);
    }

}
