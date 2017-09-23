package DLS;

import DLS.ASTNodes.*;
import DLS.ASTNodes.enums.attributes.PageGroupAttribute;
import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.ASTNodes.enums.attributes.*;
import DLS.ASTNodes.enums.methods.*;
import DLS.ASTNodes.statement.*;
import DLS.ASTNodes.statement.built.in.commands.ReceiveDataBlockingNode;
import DLS.ASTNodes.statement.built.in.commands.SendDataNode;
import DLS.ASTNodes.statement.expression.AssignNode;
import DLS.ASTNodes.statement.expression.CallNode;
import DLS.ASTNodes.statement.expression.DotNode;
import DLS.ASTNodes.statement.expression.IdentifierNode;
import DLS.ASTNodes.statement.expression.literal.*;
import DLS.ASTNodes.statement.expression.logical.AndNode;
import DLS.ASTNodes.statement.expression.logical.EqualsNode;
import DLS.ASTNodes.statement.expression.logical.NotNode;
import DLS.ASTNodes.statement.expression.logical.OrNode;
import DLS.ASTNodes.statement.expression.math.AddNode;
import DLS.ASTNodes.statement.expression.math.MinusNode;
import DLS.ASTNodes.statement.expression.math.MultiplyNode;
import DLS.ASTNodes.statement.expression.relational.LessThanEqualsNode;
import DLS.ASTNodes.statement.expression.relational.LessThanNode;
import DLS.ASTNodes.statement.expression.relational.MoreThanEqualsNode;
import DLS.ASTNodes.statement.expression.relational.MoreThanNode;
import DLS.generated.DLSParser;
import DLS.generated.DLSParserBaseVisitor;

import java.util.*;
import java.util.stream.Collectors;

public class ParseTreeVisitor extends DLSParserBaseVisitor<Node> {

    private final Map<String, String> rowImplicitValues = new HashMap<>();
    private final Map<String, String> colImplicitValues = new HashMap<>();
    private final Map<String, String> questionImplicitValues = new HashMap<>();
    //the keys of pageGroupImplicitValues and pageImplicitValues use the identifier forms.
    private final Map<String, String> pageGroupImplicitValues = new HashMap<>();
    private final Map<String, String> pageImplicitValues = new HashMap<>();

    public ParseTreeVisitor(){
        super();
        //row implicit attribute values
        rowImplicitValues.put(RowAttributes.HIDE.getName(), "true");
        rowImplicitValues.put(RowAttributes.FIXED.getName(), "true");
        rowImplicitValues.put(RowAttributes.XOR.getName(), "true");
        rowImplicitValues.put(RowAttributes.TEXTBOX.getName(), "true");

        //column implicit attribute values
        colImplicitValues.put(ColAttributes.HIDE.getName(), "true");
        colImplicitValues.put(ColAttributes.FIXED.getName(), "true");
        colImplicitValues.put(ColAttributes.XOR.getName(), "true");
        colImplicitValues.put(ColAttributes.TEXTBOX.getName(), "true");

        //question implicit attribute values
        questionImplicitValues.put(QuestionAttributes.HIDE.getName(), "true");
        questionImplicitValues.put(QuestionAttributes.RANDOMIZE.getName(), "true");
        questionImplicitValues.put(QuestionAttributes.ROTATE.getName(), "true");
        questionImplicitValues.put(QuestionAttributes.REQUIRED.getName(), "true");

        //page group implicit attribute values
        pageGroupImplicitValues.put(PageGroupAttribute.RANDOMIZE.toIdentifierName(), "true");
        pageGroupImplicitValues.put(PageGroupAttribute.ROTATE.toIdentifierName(), "true");

        //page implicit attribute values
        pageImplicitValues.put(PageAttributes.RANDOMIZE.toIdentifierName(), "true");
        pageImplicitValues.put(PageAttributes.ROTATE.toIdentifierName(), "true");
    }

    private int randomIdentifierNameCounter = 1;

    private String generateRandomIdentifierName() {
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
        //page group attributes
        List<StatementNode> attribStats = getAttributeStatements(ctx.attributes(), pageGroupImplicitValues);
        statements.addAll(attribStats);

        List<Node> pageNodes = ctx.page()
                .stream()
                .map(this::visitPage)
                .collect(Collectors.toList());

        List<FuncDefNode> pageDefFuncs = pageNodes.stream().map(node -> {
            PageNode pageNode = (PageNode) node;
            return pageNode.pageFuncDef;
        }).collect(Collectors.toList());

        //define all page functions
        //todo: check why only one page def function was added?
        statements.addAll(pageDefFuncs);

        //all page function identifiers
        List<IdentifierNode> funcIdentifiers = pageDefFuncs.stream()
                .map(FuncDefNode::getName)
                .collect(Collectors.toList());

        //define a list of list to hold all page functions
        IdentifierNode callOrderListIdentifier = new IdentifierNode(this.generateRandomIdentifierName());
        //initialise the list by putting all page function identifier into it.
        ListLiteralNode pageFuncNameList = new ListLiteralNode(funcIdentifiers);
        DefNode defCallOrders = new DefNode(callOrderListIdentifier, pageFuncNameList);

        statements.add(defCallOrders);

        //call list.randomize if page group attribute "randomize" evaluates to true.
        CallNode randomizeCall = new CallNode(callOrderListIdentifier, new IdentifierNode(ListMethods.RANDOMIZE.getName()));
        //previously we should have already declared and initialized a local variable with the name "_randomize", now we need to read its value
        IdentifierNode _randomize = new IdentifierNode(PageGroupAttribute.RANDOMIZE.toIdentifierName());
        //equals to true
        EqualsNode isTrue = new EqualsNode(_randomize, new BooleanNode(true));
        //equals to "true"
        EqualsNode isTrueStr = new EqualsNode(_randomize, new StringNode("true"));
        OrNode either = new OrNode(isTrue, isTrueStr);
        IfElseNode maybeRandomize = new IfElseNode(either, randomizeCall);
        statements.add(maybeRandomize);

        //call list.randomize if page group attribute "rotate" evaluates to true.
        CallNode rotateCall = new CallNode(callOrderListIdentifier, new IdentifierNode(ListMethods.ROTATE.getName()));
        //previously we should have already declared and initialized a local variable with the name "_rotate", now we need to read its value
        IdentifierNode _rotate = new IdentifierNode(PageGroupAttribute.ROTATE.toIdentifierName());
        //equals to true
        EqualsNode isTrue1 = new EqualsNode(_rotate, new BooleanNode(true));
        //equals to "true"
        EqualsNode isTrueStr1 = new EqualsNode(_rotate, new StringNode("true"));
        OrNode either1 = new OrNode(isTrue1, isTrueStr1);
        IfElseNode maybeRotate = new IfElseNode(either1, rotateCall);
        statements.add(maybeRotate);

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

        for (DLSParser.AttributeContext ac : attrCtxs.attribute()) {
            if (ac instanceof DLSParser.AttributeWithAssignedStringValueContext) {
                attributeStatements.addAll(getAttributeStatements((DLSParser.AttributeWithAssignedStringValueContext) ac));
            } else if (ac instanceof DLSParser.AttributeWithAssignedExpressionContext) {
                attributeStatements.addAll(getAttributeStatements((DLSParser.AttributeWithAssignedExpressionContext) ac));
            } else {
                attributeStatements.addAll(getAttributeStatements((DLSParser.AttributeWithDefaultValueContext) ac, attribImplicitValues));
            }
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

        ExpressionNode expNode = visitExpression(ac.expression());
        if (expNode instanceof AssignNode) throw new RuntimeException("attribute expression cannot be an assignment");
        //user cannot define objects. So objects must be either row literals or col literals.
        if (expNode instanceof ObjectLiteralNode) throw new RuntimeException("attribute expression cannot be row / column literal");

        AssignNode assign = new AssignNode(identifier, expNode);

        List<StatementNode> statements = new ArrayList<>(2);
        statements.add(def);
        statements.add(assign);
        return statements;
    }

    //more preciously, here the name should be "AttributeWithImplicitValue" rather than "AttributeWithDefaultValue"
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

        System.out.println(ctx.question().size());
        System.out.println(ctx.question().get(0).singleChoiceQuestion().row().size());

        //a list of DefNode
        List<StatementNode> questionStatements = ctx.question()
                .stream()
                .map(this::getQuestionStatements)
                .collect(Collectors.toList());
        statementNodes.addAll(questionStatements);

        List<IdentifierNode> questionIdentifiers = questionStatements.stream()
                .map(sn -> (DefNode)sn)
                .map(DefNode::getIdentifier)
                .collect(Collectors.toList());

        SendDataNode sdn = new SendDataNode(questionIdentifiers);
        statementNodes.add(sdn);
        ReceiveDataBlockingNode rdbn = new ReceiveDataBlockingNode();
        statementNodes.add(rdbn);

        statementNodes.addAll(getScriptStatements(postScript));

        Optional<String> maybeId = ctx.attributes()
                .attribute()
                .stream()
                .map(DLSParser.AttributeContext::getText)
                .filter(text -> text.equals(PageAttributes.ID.getName()))
                .findFirst();
        String funcName = maybeId.orElse(this.generateRandomIdentifierName());
        IdentifierNode funcNameNode = new IdentifierNode(funcName);

        FuncDefNode pageFuncDef = new FuncDefNode(funcNameNode, statementNodes);
        CallNode pageFuncCall = new CallNode(funcNameNode);

        return new PageNode(pageFuncDef, pageFuncCall);
    }

    private StatementNode getQuestionStatements(DLSParser.QuestionContext questionCtx) {
        //todo: add other question types.
        if(questionCtx.singleChoiceQuestion() != null) {
            DLSParser.SingleChoiceQuestionContext sc = questionCtx.singleChoiceQuestion();
            return getSingleQuestionStatements(sc);
        } else {
            DLSParser.MultipleChoiceQuestionContext mc = questionCtx.multipleChoiceQuestion();
            return getMultipleQuestionStatements(mc);
        }
    }

    //todo: review
    private StatementNode getSingleQuestionStatements(DLSParser.SingleChoiceQuestionContext sc){
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(sc.attributes(), questionImplicitValues);

        String questionText = sc.TextArea().getText();
        ObjectLiteralNode.Field questionTextField = new ObjectLiteralNode.Field("text", new StringNode(questionText));
        fields.add(questionTextField);

        List<ObjectLiteralNode> rowLiterals = sc.rows.stream().map(this::getRowObjectLiteralFromRowTag).collect(Collectors.toList());
        ListLiteralNode rowLiteralList = new ListLiteralNode(rowLiterals);
        ObjectLiteralNode.Field rowsField = new ObjectLiteralNode.Field("rows", rowLiteralList);
        fields.add(rowsField);

        IdentifierNode tmpIdentifier = new IdentifierNode(generateRandomIdentifierName());
        return new DefNode(tmpIdentifier, new ObjectLiteralNode(fields));
    }

    @SuppressWarnings("Duplicates")
    private ObjectLiteralNode getRowObjectLiteralFromRowTag(DLSParser.RowContext rc) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(rc.attributes(), rowImplicitValues);

        String rowText = rc.TextArea().getText();
        ObjectLiteralNode.Field rowTextField = new ObjectLiteralNode.Field("text", new StringNode(rowText));
        fields.add(rowTextField);

        return new ObjectLiteralNode(fields);
    }

    @SuppressWarnings("Duplicates")
    private ObjectLiteralNode getColObjectLiteralFromColTag(DLSParser.ColContext cc) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(cc.attributes(), colImplicitValues);

        String colText = cc.TextArea().getText();
        ObjectLiteralNode.Field colTextField = new ObjectLiteralNode.Field("text", new StringNode(colText));
        fields.add(colTextField);

        return new ObjectLiteralNode(fields);
    }

    private StatementNode getMultipleQuestionStatements(DLSParser.MultipleChoiceQuestionContext mc) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(mc.attributes(), questionImplicitValues);

        String questionText = mc.TextArea().getText();
        ObjectLiteralNode.Field questionTextField = new ObjectLiteralNode.Field("text", new StringNode(questionText));
        fields.add(questionTextField);

        List<ObjectLiteralNode> rowLiterals = mc.rows.stream().map(this::getRowObjectLiteralFromRowTag).collect(Collectors.toList());
        List<ObjectLiteralNode> colLiterals = mc.cols.stream().map(this::getColObjectLiteralFromColTag).collect(Collectors.toList());

        ListLiteralNode rowLiteralList = new ListLiteralNode(rowLiterals);
        ListLiteralNode colLiteralList = new ListLiteralNode(colLiterals);

        ObjectLiteralNode.Field rowsField = new ObjectLiteralNode.Field("rows", rowLiteralList);
        ObjectLiteralNode.Field colsField = new ObjectLiteralNode.Field("cols", colLiteralList);

        fields.add(rowsField);
        fields.add(colsField);

        IdentifierNode tmpIdentifier = new IdentifierNode(generateRandomIdentifierName());
        return new DefNode(tmpIdentifier, new ObjectLiteralNode(fields));
    }

    @Override
    public Node visitStatement(DLSParser.StatementContext ctx) {
        if (ctx.variableStatement() != null) return visitVariableStatement(ctx.variableStatement());
        if (ctx.emptyStatement() != null) return new EmptyNode();
        if (ctx.expressionStatement() != null) return visitExpressionStatement(ctx.expressionStatement());
        if (ctx.ifStatement() != null) return visitIfStatement(ctx.ifStatement());
        //todo: supports listOperationStatement
        //todo: supports return statement
        //todo: chance statement
        //todo: built in command statement
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

    private ExpressionNode visitExpression(DLSParser.ExpressionContext ctx) {
        if (ctx instanceof DLSParser.MemberExpressionContext) {
            return (ExpressionNode) visitMemberExpression((DLSParser.MemberExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.CallExpressionContext) {
            return (ExpressionNode) visitCallExpression((DLSParser.CallExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.NotExpressionContext) {
            return (ExpressionNode) visitNotExpression((DLSParser.NotExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.MultiplicativeExpressionContext) {
            return (ExpressionNode) visitMultiplicativeExpression((DLSParser.MultiplicativeExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.AdditiveExpressionContext) {
            return (ExpressionNode) visitAdditiveExpression((DLSParser.AdditiveExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.RelationalExpressionContext) {
            return (ExpressionNode) visitRelationalExpression((DLSParser.RelationalExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.EqualityExpressionContext) {
            return (ExpressionNode) visitEqualityExpression((DLSParser.EqualityExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.LogicalAndExpressionContext) {
            return (ExpressionNode) visitLogicalAndExpression((DLSParser.LogicalAndExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.LogicalOrExpressionContext) {
            return (ExpressionNode) visitLogicalOrExpression((DLSParser.LogicalOrExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.AssignmentExpressionContext) {
            return (ExpressionNode) visitAssignmentExpression((DLSParser.AssignmentExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.IdentifierExpressionContext) {
            return (ExpressionNode) visitIdentifierExpression((DLSParser.IdentifierExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.LiteralExpressionContext) {
            return (ExpressionNode) visitLiteralExpression((DLSParser.LiteralExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.ListLiteralExpressionContext) {
            return (ExpressionNode) visitListLiteralExpression((DLSParser.ListLiteralExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.RowLiteralExpressionContext) {
            return (ExpressionNode) visitRowLiteralExpression((DLSParser.RowLiteralExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.ColumnLiteralExpressionContext) {
            return (ExpressionNode) visitColumnLiteralExpression((DLSParser.ColumnLiteralExpressionContext) ctx);
        } else {
            //must be instance ParenthesizedExpression
            return (ExpressionNode) visitParenthesizedExpression((DLSParser.ParenthesizedExpressionContext) ctx);
        }
    }

    @Override
    public Node visitParenthesizedExpression(DLSParser.ParenthesizedExpressionContext ctx) {
        return visitExpression(ctx.expression());
    }

    @Override
    public Node visitColumnLiteralExpression(DLSParser.ColumnLiteralExpressionContext ctx) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(ctx.colLiteral().attributes(), colImplicitValues);
        return new ObjectLiteralNode(fields);
    }

    @Override
    public Node visitRowLiteralExpression(DLSParser.RowLiteralExpressionContext ctx) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(ctx.rowLiteral().attributes(), rowImplicitValues);
        return new ObjectLiteralNode(fields);
    }

    private List<ObjectLiteralNode.Field> getObjectLiteralFieldsFromAttributes(DLSParser.AttributesContext ac, Map<String, String> implicitValues) {
        return ac.attribute().stream().map(attrb -> {
            if(attrb instanceof DLSParser.AttributeWithAssignedStringValueContext) {
                DLSParser.AttributeWithAssignedStringValueContext c = (DLSParser.AttributeWithAssignedStringValueContext)attrb;
                String fieldName = c.Name().getText();
                String val = c.String().getText();
                return new ObjectLiteralNode.Field(fieldName, new StringNode(val));
            } else if(attrb instanceof DLSParser.AttributeWithAssignedExpressionContext) {
                DLSParser.AttributeWithAssignedExpressionContext c = (DLSParser.AttributeWithAssignedExpressionContext)attrb;
                String fieldName = c.Name().getText();
                ExpressionNode exp = visitExpression(c.expression());
                return new ObjectLiteralNode.Field(fieldName, exp);
            } else {
                DLSParser.AttributeWithDefaultValueContext c = (DLSParser.AttributeWithDefaultValueContext)attrb;
                String fieldName = c.Name().getText();
                String val = implicitValues.get(fieldName);
                return new ObjectLiteralNode.Field(fieldName, new StringNode(val));
            }
        }).collect(Collectors.toList());
    }

    @Override
    public Node visitAdditiveExpression(DLSParser.AdditiveExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        if (ctx.Minus() != null) {
            return new MinusNode(left, right);
        } else {
            return new AddNode(left, right);
        }
    }

    @Override
    public Node visitRelationalExpression(DLSParser.RelationalExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));

        if (ctx.LessThan() != null) {
            return new LessThanNode(left, right);
        } else if (ctx.MoreThan() != null) {
            return new MoreThanNode(left, right);
        } else if (ctx.LessThanEquals() != null) {
            return new LessThanEqualsNode(left, right);
        } else {
            return new MoreThanEqualsNode(left, right);
        }
    }

    @Override
    public Node visitLogicalAndExpression(DLSParser.LogicalAndExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new AndNode(left, right);
    }

    @Override
    public Node visitLiteralExpression(DLSParser.LiteralExpressionContext ctx) {
        //here we do not have object literal cos user cannot define objects.
        DLSParser.LiteralContext lctx = ctx.literal();
        if (lctx instanceof DLSParser.DecimalLiteralContext) {
            double d = Double.valueOf(lctx.getText());
            return new NumberNode(d);
        } else if (lctx instanceof DLSParser.BooleanLiteralContext) {
            String isTrue = lctx.getText();
            return new BooleanNode(Boolean.valueOf(isTrue));
        } else {
            String str = lctx.getText();
            return new StringNode(str);
        }
    }

    @Override
    public Node visitListLiteralExpression(DLSParser.ListLiteralExpressionContext ctx) {
        List<ExpressionNode> elements = convertExpressionContextsToExpressionNodes(
                ctx.listLiteral()
                        .listElements()
                        .expression()
        );
        return new ListLiteralNode(elements);
    }

    private List<ExpressionNode> convertExpressionContextsToExpressionNodes(Collection<DLSParser.ExpressionContext> ctxs) {
        return ctxs.stream()
                .map(this::visitExpression)
                .collect(Collectors.toList());
    }

    @Override
    public Node visitLogicalOrExpression(DLSParser.LogicalOrExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new OrNode(left, right);
    }

    @Override
    public Node visitNotExpression(DLSParser.NotExpressionContext ctx) {
        ExpressionNode target = visitExpression(ctx.expression());
        return new NotNode(target);
    }

    @Override
    public Node visitIdentifierExpression(DLSParser.IdentifierExpressionContext ctx) {
        return new IdentifierNode(ctx.getText());
    }

    @Override
    public Node visitMemberExpression(DLSParser.MemberExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression());
        IdentifierNode right = new IdentifierNode(ctx.Identifier().getText());
        return new DotNode(left, right);
    }

    @Override
    public Node visitAssignmentExpression(DLSParser.AssignmentExpressionContext ctx) {
        ExpressionNode target = visitExpression(ctx.expression(0));
        ExpressionNode value = visitExpression(ctx.expression(1));
        return new AssignNode(target, value);
    }

    @Override
    public Node visitEqualityExpression(DLSParser.EqualityExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new EqualsNode(left, right);
    }

    @Override
    public Node visitMultiplicativeExpression(DLSParser.MultiplicativeExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new MultiplyNode(left, right);
    }

    @Override
    public Node visitCallExpression(DLSParser.CallExpressionContext ctx) {
        DLSParser.ExpressionContext e = ctx.expression();
        List<ExpressionNode> args;
        if(ctx.argumentList().expression() != null ) {
            args = convertExpressionContextsToExpressionNodes(ctx.argumentList().expression());
        } else {
            args = Collections.emptyList();
        }

        if (e instanceof DLSParser.MemberExpressionContext) {
            //invokes a method
            DotNode methodInvoke = (DotNode) visitExpression(e);
            return new CallNode(methodInvoke.getLeft(), methodInvoke.getRight(), args);
        } else {
            //calls a first class function
            IdentifierNode funcName = (IdentifierNode) visitExpression(e);
            return new CallNode(funcName, args);
        }
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

        if (ctx.elseStatement().noEndingIfStatement() != null) {
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
                .map(node -> (StatementNode) node)
                .collect(Collectors.toList());
    }
}
