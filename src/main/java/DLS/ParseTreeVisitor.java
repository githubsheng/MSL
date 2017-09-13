package DLS;

import DLS.ASTNodes.FileNode;
import DLS.ASTNodes.Node;
import DLS.ASTNodes.PageNode;
import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.statement.DefNode;
import DLS.ASTNodes.statement.IfElseNode;
import DLS.ASTNodes.statement.StatementNode;
import DLS.ASTNodes.statement.expression.AssignNode;
import DLS.ASTNodes.statement.expression.CallNode;
import DLS.ASTNodes.statement.expression.DotNode;
import DLS.ASTNodes.statement.expression.IdentifierNode;
import DLS.ASTNodes.statement.expression.literal.ListLiteralNode;
import DLS.ASTNodes.statement.expression.relational.EqualsNode;
import DLS.generated.DLSParser;
import DLS.generated.DLSParserBaseVisitor;

import javax.print.DocFlavor;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class ParseTreeVisitor extends DLSParserBaseVisitor<Node> {

    //todo: define these as enums later
    public final static String ID = "id";
    public final static String BUILT_IN_LIST_METHOD = "randomize";

    private int randomIdentifierNameCounter = 1;
    private String generateRandomIdentifierName(){
        return "_generatedIdentifierName" + (++randomIdentifierNameCounter);
    }

    @Override
    public Node visitFile(DLSParser.FileContext ctx) {
        //we sees pages as functions ( has its own local variable scope )
        //we sees a page group as a function that contains functions (pages)
        List<Node> nodes = ctx.element()
                .stream()
                .map(this::getPageNodeOrPageGroupNode)
                .collect(Collectors.toList());
        return new FileNode(nodes);
    }

    private Node getPageNodeOrPageGroupNode(DLSParser.ElementContext ctx) {
        return ctx.page() != null ? visitPage(ctx.page()) : visitPageGroup(ctx.pageGroup());
    }

    @Override
    public Node visitPageGroup(DLSParser.PageGroupContext ctx) {
        List<StatementNode> statements = new ArrayList<>();

        List<StatementNode> attribStats = this.getAttributeStatements(ctx.attributes());
        statements.addAll(attribStats);

        List<Node> pageNodes = ctx.page()
                .stream()
                .map(this::visitPage)
                .collect(Collectors.toList());

        List<FuncDefNode> pageDefFuncs = pageNodes.stream().map(node -> {
            PageNode pageNode = (PageNode)node;
            return pageNode.pageFuncDef;
        }).collect(Collectors.toList());

        statements.addAll(pageDefFuncs);

        List<IdentifierNode> funcIdentifiers = pageDefFuncs.stream()
                .map(FuncDefNode::getName)
                .collect(Collectors.toList());

        IdentifierNode callOrderListIdentifier = new IdentifierNode(this.generateRandomIdentifierName());
        DefNode defCallOrders = new DefNode(callOrderListIdentifier);

        ListLiteralNode callOrders = new ListLiteralNode(funcIdentifiers);
        AssignNode listAssign = new AssignNode(callOrderListIdentifier, callOrders);

        statements.add(defCallOrders);
        statements.add(listAssign);

        //todo: add support for rotate as well
        CallNode randomizeCall = new CallNode(callOrderListIdentifier, new IdentifierNode(BUILT_IN_LIST_METHOD));
        IfElseNode maybeRandomize = new IfElseNode(new IdentifierNode(PageGroupAttribute.RANDOMIZE.toString()), randomizeCall);
        statements.add(maybeRandomize);

        //todo: loop the call orders and call each page func

        //todo: page group func def
        //todo: page group func call
        
        return null;
    }

    private List<StatementNode> getAttributeStatements(DLSParser.AttributesContext attrCtxs) {
        //todo:
        return null;
    }

    private List<StatementNode> getScriptStatements(DLSParser.ScriptContext scriptCtx) {
        return scriptCtx.statement().stream().map(statementCtx -> {
            Node node = visitStatement(statementCtx);
            return (StatementNode) node;
        }).collect(Collectors.toList());
    }

    @Override
    public Node visitPage(DLSParser.PageContext ctx) {
        DLSParser.ScriptContext preScript = ctx.script(0);
        DLSParser.ScriptContext postScript = ctx.script(1);

        List<StatementNode> statementNodes = new ArrayList<>();
        statementNodes.addAll(getScriptStatements(preScript));
        List<StatementNode> questionStatements = ctx.question()
                .stream()
                .map(this::getQuestionStatement)
                .flatMap(List::stream)
                .collect(Collectors.toList());
        statementNodes.addAll(questionStatements);
        statementNodes.addAll(getScriptStatements(postScript));

        Optional<String> maybeId = ctx.attributes()
                .attribute()
                .stream()
                .map(DLSParser.AttributeContext::getText)
                .filter(text -> text.equals(ID))
                .findFirst();
        String funcName = maybeId.orElse(this.generateRandomIdentifierName());
        IdentifierNode funcNameNode = new IdentifierNode(funcName);

        FuncDefNode pageFuncDef = new FuncDefNode(funcNameNode, statementNodes);
        CallNode pageFuncCall = new CallNode(funcNameNode);

        return new PageNode(pageFuncDef, pageFuncCall);
    }

    private List<StatementNode> getQuestionStatement(DLSParser.QuestionContext questionCtx) {
        //todo:
        return null;
    }

    @Override
    public Node visitStatement(DLSParser.StatementContext ctx) {

        return null;
    }

}
