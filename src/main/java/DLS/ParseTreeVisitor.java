package DLS;

import DLS.ASTNodes.*;
import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.statement.*;
import DLS.ASTNodes.statement.expression.AssignNode;
import DLS.ASTNodes.statement.expression.CallNode;
import DLS.ASTNodes.statement.expression.IdentifierNode;
import DLS.ASTNodes.statement.expression.literal.BooleanNode;
import DLS.ASTNodes.statement.expression.literal.ListLiteralNode;
import DLS.ASTNodes.statement.expression.literal.StringNode;
import DLS.ASTNodes.statement.expression.logical.BinaryLogicalNode;
import DLS.generated.DLSParser;
import DLS.generated.DLSParserBaseVisitor;

import java.util.*;
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
        //page group function statements
        List<StatementNode> statements = new ArrayList<>();

        //todo: semantic checking: warn invalid attribute name
        //todo: method getAttributeStatements should also take a attribute name -> default value mapping
        //page group attributes
        List<StatementNode> attribStats = getAttributeStatements(ctx.attributes(), PageGroupNode.implicitValues);
        statements.addAll(attribStats);

        List<Node> pageNodes = ctx.page()
                .stream()
                .map(this::visitPage)
                .collect(Collectors.toList());

        List<FuncDefNode> pageDefFuncs = pageNodes.stream().map(node -> {
            PageNode pageNode = (PageNode)node;
            return pageNode.pageFuncDef;
        }).collect(Collectors.toList());

        //define all page functions
        statements.addAll(pageDefFuncs);

        //all page function identifiers
        List<IdentifierNode> funcIdentifiers = pageDefFuncs.stream()
                .map(FuncDefNode::getName)
                .collect(Collectors.toList());

        //define a list of list to hold all page functions
        IdentifierNode callOrderListIdentifier = new IdentifierNode(this.generateRandomIdentifierName());
        DefNode defCallOrders = new DefNode(callOrderListIdentifier);

        //initialise the list by putting all page function identifier into it.
        ListLiteralNode callOrders = new ListLiteralNode(funcIdentifiers);
        AssignNode listAssign = new AssignNode(callOrderListIdentifier, callOrders);

        statements.add(defCallOrders);
        statements.add(listAssign);


        //todo: add support for rotate as well
        //call list.randomize if page group attribute "randomize" evaluates to true.
        CallNode randomizeCall = new CallNode(callOrderListIdentifier, new IdentifierNode(BUILT_IN_LIST_METHOD));

        IdentifierNode _randomize = new IdentifierNode(PageGroupAttribute.RANDOMIZE.toIdentifierName());
        //todo: this condition should be refactored....
        //equals to true
        BinaryLogicalNode isTrue = new BinaryLogicalNode(BinaryLogicalNode.OperatorType.EQUALS, _randomize, new BooleanNode(true));
        //equals to "true"
        BinaryLogicalNode isTrueStr = new BinaryLogicalNode(BinaryLogicalNode.OperatorType.EQUALS, _randomize, new StringNode("true"));
        BinaryLogicalNode either = new BinaryLogicalNode(BinaryLogicalNode.OperatorType.OR, isTrue, isTrueStr);

        IfElseNode maybeRandomize = new IfElseNode(either, randomizeCall);
        statements.add(maybeRandomize);

        //loop the list, get the page functions and call them one by one.
        ListOptNode loop = new ListOptNode(ListOptNode.ListOptType.LOOP, callOrderListIdentifier, Collections.singletonList(new CallNode(ListOptNode.$element)));
        statements.add(loop);

        //page group func def
        IdentifierNode pageGroupFuncName = new IdentifierNode(generateRandomIdentifierName());
        FuncDefNode pageGroupFuncDef = new FuncDefNode(pageGroupFuncName, statements);

        //page group func call
        CallNode pageGroupFuncCall = new CallNode(pageGroupFuncName);
        return new PageGroupNode(pageGroupFuncDef, pageGroupFuncCall);
    }

    private List<StatementNode> getAttributeStatements(DLSParser.AttributesContext attrCtxs, Map<String, String> attribImplicitValues) {

        List<StatementNode> attributeStatements = new ArrayList<>();

        for(DLSParser.AttributeContext ac : attrCtxs.attribute()) {
            if(ac instanceof DLSParser.AttributeWithAssignedStringValueContext) {
                attributeStatements.addAll(getAttributeStatements((DLSParser.AttributeWithAssignedStringValueContext)ac));
            } else if (ac instanceof DLSParser.AttributeWithAssignedExpressionContext) {
                attributeStatements.addAll(getAttributeStatements((DLSParser.AttributeWithAssignedExpressionContext)ac));
            } else {
                attributeStatements.addAll(getAttributeStatements((DLSParser.AttributeWithDefaultValueContext)ac, attribImplicitValues));            }
        }
        return attributeStatements;
    }

    private List<StatementNode> getAttributeStatements(DLSParser.AttributeWithAssignedStringValueContext ac) {
        IdentifierNode identifier = convertAttributeNameToIdentifier(ac.Name().getText());

        DefNode def = new DefNode(identifier);

        StringNode str = new StringNode(ac.String().getText());
        AssignNode assign = new AssignNode(identifier, str);

        List<StatementNode> statements = new ArrayList<>(2);
        statements.add(def);
        statements.add(assign);
        return statements;
    }

    private List<StatementNode> getAttributeStatements(DLSParser.AttributeWithAssignedExpressionContext ac) {
        IdentifierNode identifier = convertAttributeNameToIdentifier(ac.Name().getText());

        DefNode def = new DefNode(identifier);

        //todo: here we need to check this expression and make sure it is not an assignment.
        /*
            expression type that are not allowed:
            AssignNode
            RowLiteralNode todo: define this node
            ColumnLiteralNode todo: define this node
         */
        ExpressionNode expNode = visitExpression(ac.expression());
        if(expNode instanceof AssignNode) throw new RuntimeException("attribute expression cannot be an assignment");

        AssignNode assign = new AssignNode(identifier, expNode);

        List<StatementNode> statements = new ArrayList<>(2);
        statements.add(def);
        statements.add(assign);
        return statements;
    }

    private List<StatementNode> getAttributeStatements(DLSParser.AttributeWithDefaultValueContext ac, Map<String, String> attribImplicitValues) {
        IdentifierNode identifier = convertAttributeNameToIdentifier(ac.Name().getText());
        DefNode def = new DefNode(identifier);

        StringNode str = new StringNode(attribImplicitValues.get(identifier.name));
        AssignNode assign = new AssignNode(identifier, str);

        List<StatementNode> statements = new ArrayList<>(2);
        statements.add(def);
        statements.add(assign);
        return statements;
    }

    private IdentifierNode convertAttributeNameToIdentifier(String attributeName) {
        return new IdentifierNode("_" + attributeName);
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

        //todo: here we should use get attributes function instead...
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
        if(ctx.variableStatement() != null) return visitVariableStatement(ctx.variableStatement());
        if(ctx.emptyStatement() != null) return new EmptyNode();
        if(ctx.expressionStatement() != null) return visitExpressionStatement(ctx.expressionStatement());
        if(ctx.ifStatement() != null) return visitIfStatement(ctx.ifStatement());
        return null;
    }

    @Override
    public Node visitVariableStatement(DLSParser.VariableStatementContext ctx) {
        IdentifierNode name = new IdentifierNode(ctx.Identifier().getText());
        ExpressionNode initializer = visitExpression(ctx.initialiser().expression());
        return new DefNode(name, initializer);
    }

    @Override
    public Node visitExpressionStatement(DLSParser.ExpressionStatementContext ctx) {
        return visitExpression(ctx.expression());
    }

    //todo:
    private ExpressionNode visitExpression(DLSParser.ExpressionContext expCtx) {
        return null;
    }

    @Override
    public Node visitIfStatement(DLSParser.IfStatementContext ctx) {
        List<IfElseNode.Branch> branches = new ArrayList<>();
        createBranchFromNoEndingIfStatement(ctx.noEndingIfStatement(), branches);
        return new IfElseNode(branches);
    }

    //read the ifStatement rule in the parser rule otherwise it would be very difficult to understand the code here.
    private void createBranchFromNoEndingIfStatement(DLSParser.NoEndingIfStatementContext ctx, List<IfElseNode.Branch> branches) {
        ExpressionNode condition = visitExpression(ctx.expression());
        List<StatementNode> statements = createListOfStatementNodes(ctx.statements());
        IfElseNode.Branch branch = new IfElseNode.Branch(condition, statements);
        branches.add(branch);

        if(ctx.elseStatement().noEndingIfStatement() != null) {
            createBranchFromNoEndingIfStatement(ctx.elseStatement().noEndingIfStatement(), branches);
        } else {
            //create the catch all "else statement" in the end.
            ExpressionNode alwaysTrue = new BooleanNode(true);
            List<StatementNode> lastBranchStatements = createListOfStatementNodes(ctx.elseStatement().statements());
            IfElseNode.Branch lastBranch = new IfElseNode.Branch(alwaysTrue, lastBranchStatements);
            branches.add(lastBranch);
        }
    }

    private List<StatementNode> createListOfStatementNodes(DLSParser.StatementsContext ctx) {
        return ctx.statement()
                .stream()
                .map(this::visitStatement)
                .map(node -> (StatementNode)node)
                .collect(Collectors.toList());
    }
}
