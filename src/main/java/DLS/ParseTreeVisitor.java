package DLS;

import DLS.ASTNodes.*;
import DLS.ASTNodes.enums.attributes.PageGroupAttribute;
import DLS.ASTNodes.enums.built.in.fields.AnswerFields;
import DLS.ASTNodes.enums.built.in.funcNames.BuiltInFuncNames;
import DLS.ASTNodes.statement.FuncDefNode;
import DLS.ASTNodes.enums.attributes.*;
import DLS.ASTNodes.enums.methods.*;
import DLS.ASTNodes.statement.*;
import DLS.ASTNodes.statement.built.in.commands.EndSurveyNode;
import DLS.ASTNodes.statement.built.in.commands.ReceiveDataBlockingNode;
import DLS.ASTNodes.statement.built.in.commands.SendDataNode;
import DLS.ASTNodes.statement.expression.*;
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
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.*;
import java.util.stream.Collectors;

import static DLS.ASTNodes.enums.built.in.funcNames.BuiltInFuncNames.GetRandomNumber;

class ParseTreeVisitor {

    private final Map<String, String> rowImplicitValues = new HashMap<>();
    private final Map<String, String> colImplicitValues = new HashMap<>();
    private final Map<String, String> questionImplicitValues = new HashMap<>();
    //the keys of pageGroupImplicitValues and pageImplicitValues use the identifier forms.
    private final Map<String, String> pageGroupImplicitValues = new HashMap<>();
    private final Map<String, String> pageImplicitValues = new HashMap<>();

    //I don't like making it stateful but this requires least code changes so guess will just have to live with it for now.
    private boolean needsTokenAssociation = false;

    ParseTreeVisitor() {
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

    private String generateRandomIdentifierName(String prefix) {
        return "_" + prefix + "_gn" + (++randomIdentifierNameCounter);
    }
    
    List<StatementNode> visitFile(DLSParser.FileContext ctx) {
        //we sees pages as functions ( has its own local variable scope )
        //we sees a page group as a function that contains functions (pages)
        return ctx.element()
                .stream()
                .map(this::getPageNodeOrPageGroupNode)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    private List<StatementNode> getPageNodeOrPageGroupNode(DLSParser.ElementContext ctx) {
        return ctx.page() != null ? visitPage(ctx.page()) : visitPageGroup(ctx.pageGroup());
    }

    
    private List<StatementNode> visitPageGroup(DLSParser.PageGroupContext ctx) {
        //page group function statements
        List<StatementNode> statements = new ArrayList<>();

        //todo: semantic checking: warn invalid attribute name
        //page group attributes
        List<StatementNode> attribStats = getAttributeStatements(ctx.attributes(), pageGroupImplicitValues);
        statements.addAll(attribStats);

        List<FuncDefNode> pageDefFuncs = ctx.page().stream()
                .map(this::visitPage)
                .flatMap(List::stream)
                .filter(FuncDefNode.class::isInstance)
                .map(FuncDefNode.class::cast)
                .collect(Collectors.toList());

        //define all page functions
        statements.addAll(pageDefFuncs);

        //all page function identifiers
        List<ExpressionNode> funcIdentifiers = pageDefFuncs.stream()
                .map(FuncDefNode::getName)
                .map(ExpressionNode.class::cast)
                .collect(Collectors.toList());

        //define a list of list to hold all page functions
        IdentifierNode callOrderListIdentifier = new IdentifierNode(this.generateRandomIdentifierName());
        //initialise the list by putting all page function identifier into it.
        //creating a list is really calling global namespace function List with any number of parameters
        CallNode createPageFuncNameList = new CallNode(BuiltInFuncNames.List.getFuncName(), funcIdentifiers);
        DefNode defCallOrders = new DefNode(callOrderListIdentifier, createPageFuncNameList);

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
        IfElseNode maybeRandomize = new IfElseNode(either, new ExpressionStatementNode(randomizeCall));
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
        IfElseNode maybeRotate = new IfElseNode(either1, new ExpressionStatementNode(rotateCall));
        statements.add(maybeRotate);

        //loop the list, get the page functions and call them one by one.
        ListOptNode loop = new ListOptNode(
                ListOptNode.ListOptType.LOOP,
                callOrderListIdentifier,
                Collections.singletonList(new ExpressionStatementNode(new CallNode(ListOptNode.$element)))
        );
        statements.add(loop);

        //page group func def
        IdentifierNode pageGroupFuncName = new IdentifierNode(generateRandomIdentifierName("pageGroup"));
        FuncDefNode pageGroupFuncDef = new FuncDefNode(pageGroupFuncName, statements);

        //page group func call
        CallNode pageGroupFuncCall = new CallNode(pageGroupFuncName);

        List<StatementNode> statementNodes = new LinkedList<>();
        statementNodes.add(pageGroupFuncDef);
        statementNodes.add(new ExpressionStatementNode(pageGroupFuncCall));
        return statementNodes;
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
        String strVal = removeDoubleQuotes(ac.String().getText());
        DefNode def = new DefNode(identifier, new StringNode(strVal));
        return Collections.singletonList(def);
    }

    private List<StatementNode> getAttributeStatements(DLSParser.AttributeWithAssignedExpressionContext ac) {
        ExpressionNode expNode = visitExpression(ac.expression());
        if (expNode instanceof AssignNode) throw new RuntimeException("attribute expression cannot be an assignment");
        //user cannot define objects. So objects must be either row literals or col literals.
        if (expNode instanceof ObjectLiteralNode) throw new RuntimeException("attribute expression cannot be row / column literal");

        IdentifierNode identifier = convertAttributeNameToIdentifier(ac.Name().getText());
        DefNode def = new DefNode(identifier, expNode);

        return Collections.singletonList(def);
    }

    //more preciously, here the name should be "AttributeWithImplicitValue" rather than "AttributeWithDefaultValue"
    private List<StatementNode> getAttributeStatements(DLSParser.AttributeWithDefaultValueContext ac, Map<String, String> attribImplicitValues) {
        IdentifierNode identifier = convertAttributeNameToIdentifier(ac.Name().getText());
        StringNode str = new StringNode(attribImplicitValues.get(identifier.name));
        DefNode def = new DefNode(identifier, str);
        return Collections.singletonList(def);
    }

    private IdentifierNode convertAttributeNameToIdentifier(String attributeName) {
        return new IdentifierNode("_" + attributeName);
    }

    private List<StatementNode> getScriptStatements(DLSParser.ScriptContext scriptCtx) {
        needsTokenAssociation = true;
        List<StatementNode> ret = scriptCtx.statement().stream()
                .map(this::getStatementNodes)
                .flatMap(List::stream)
                .map(StatementNode.class::cast)
                .collect(Collectors.toList());
        needsTokenAssociation = false;
        return ret;
    }

    
    private List<StatementNode> visitPage(DLSParser.PageContext ctx) {
        DLSParser.ScriptContext preScript = ctx.script(0);
        DLSParser.ScriptContext postScript = ctx.script(1);

        List<StatementNode> statementNodes = new ArrayList<>();
        statementNodes.addAll(getScriptStatements(preScript));

        //get page attributes
        List<StatementNode> attribStats = getAttributeStatements(ctx.attributes(), pageImplicitValues);
        statementNodes.addAll(attribStats);

        //a list of DefNode
        List<StatementNode> questionStatements = ctx.question()
                .stream()
                .map(this::getQuestionStatements)
                .collect(Collectors.toList());
        statementNodes.addAll(questionStatements);

        List<IdentifierNode> questionIdentifiers = questionStatements.stream()
                .map(DefNode.class::cast)
                .map(DefNode::getIdentifier)
                .collect(Collectors.toList());

        SendDataNode sdn = new SendDataNode(questionIdentifiers);
        statementNodes.add(sdn);
        ReceiveDataBlockingNode rdbn = new ReceiveDataBlockingNode();
        statementNodes.add(rdbn);

        statementNodes.addAll(getScriptStatements(postScript));

        //todo: question identifier should be its id attribute if there is
        //todo: id attributes can only be strings
        //todo: verify the expressions....
        Optional<String> maybeId = getIdStrVal(ctx.attributes());

        String funcName = maybeId.orElse(this.generateRandomIdentifierName("page"));
        IdentifierNode funcNameNode = new IdentifierNode(funcName);

        FuncDefNode pageFuncDef = new FuncDefNode(funcNameNode, statementNodes);
        CallNode pageFuncCall = new CallNode(funcNameNode);

        List<StatementNode> statements = new LinkedList<>();
        statements.add(pageFuncDef);
        statements.add(new ExpressionStatementNode(pageFuncCall));
        return statements;
    }

    private StatementNode getQuestionStatements(DLSParser.QuestionContext questionCtx) {
        //todo: add other question types.
        if (questionCtx.singleChoiceQuestion() != null) {
            DLSParser.SingleChoiceQuestionContext sc = questionCtx.singleChoiceQuestion();
            return getSingleQuestionStatements(sc);
        } else {
            DLSParser.MultipleChoiceQuestionContext mc = questionCtx.multipleChoiceQuestion();
            return getMultipleQuestionStatements(mc);
        }
    }

    private ObjectLiteralNode.Field getQuestionTypeField(@SuppressWarnings("unused")DLSParser.SingleChoiceQuestionContext sc) {
        return new ObjectLiteralNode.Field("_type", new StringNode("single-choice"));
    }

    private ObjectLiteralNode.Field getQuestionTypeField(@SuppressWarnings("unused")DLSParser.MultipleChoiceQuestionContext mc) {
        return new ObjectLiteralNode.Field("_type", new StringNode("multiple-choice"));
    }

    private ObjectLiteralNode.Field getRowTypeField() {
        return new ObjectLiteralNode.Field("_type", new StringNode("row"));
    }

    private ObjectLiteralNode.Field getColTypeField() {
        return new ObjectLiteralNode.Field("_type", new StringNode("col"));
    }

    //todo: review
    private StatementNode getSingleQuestionStatements(DLSParser.SingleChoiceQuestionContext sc) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(sc.attributes(), questionImplicitValues);

        fields.add(getQuestionTypeField(sc));
        fields.add(getTextField(sc.textArea()));

        ObjectLiteralNode rows = getQuestionRowsField(sc.rows);
        ObjectLiteralNode.Field rowsField = new ObjectLiteralNode.Field("rows", rows);
        fields.add(rowsField);

        Optional<String> maybeId = getIdStrVal(sc.attributes());
        String identifierName = maybeId.orElse(generateRandomIdentifierName());
        IdentifierNode questionIdentifier = new IdentifierNode(identifierName);
        return new DefNode(true, questionIdentifier, new ObjectLiteralNode(fields));
    }

    private StatementNode getMultipleQuestionStatements(DLSParser.MultipleChoiceQuestionContext mc) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(mc.attributes(), questionImplicitValues);

        fields.add(getQuestionTypeField(mc));
        fields.add(getTextField(mc.textArea()));

        ObjectLiteralNode rows = getQuestionRowsField(mc.rows);
        ObjectLiteralNode.Field rowsField = new ObjectLiteralNode.Field("rows", rows);

        ObjectLiteralNode cols = getQuestionColumnsField(mc.cols);
        ObjectLiteralNode.Field colsField = new ObjectLiteralNode.Field("cols", cols);

        fields.add(rowsField);
        fields.add(colsField);

        Optional<String> maybeId = getIdStrVal(mc.attributes());
        String identifierName = maybeId.orElse(generateRandomIdentifierName());
        IdentifierNode questionIdentifier = new IdentifierNode(identifierName);
        return new DefNode(true, questionIdentifier, new ObjectLiteralNode(fields));
    }

    private ObjectLiteralNode getQuestionRowsField(List<DLSParser.RowContext> rows) {
        List<ObjectLiteralNode.Field> rowLiteralsAsFields = rows.stream().map(rc -> {
            ObjectLiteralNode rowLiteral = getRowObjectLiteralFromRowTag(rc);
            String referenceName = getIdStrVal(rc.attributes()).orElse(generateRandomIdentifierName());
            return new ObjectLiteralNode.Field(referenceName, rowLiteral);
        }).collect(Collectors.toList());

        rowLiteralsAsFields.add(getRowTypeField());

        return new ObjectLiteralNode(rowLiteralsAsFields);
    }

    private ObjectLiteralNode getQuestionColumnsField(List<DLSParser.ColContext> cols) {
        List<ObjectLiteralNode.Field> colLiteralsAsFields = cols.stream().map(cc -> {
            ObjectLiteralNode colLiteral = getColObjectLiteralFromColTag(cc);
            String referenceName = getIdStrVal(cc.attributes()).orElse(generateRandomIdentifierName());
            return new ObjectLiteralNode.Field(referenceName, colLiteral);
        }).collect(Collectors.toList());

        colLiteralsAsFields.add(getColTypeField());

        return new ObjectLiteralNode(colLiteralsAsFields);

    }

    @SuppressWarnings("Duplicates")
    private ObjectLiteralNode getRowObjectLiteralFromRowTag(DLSParser.RowContext rc) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(rc.attributes(), rowImplicitValues);
        fields.add(getTextField(rc.textArea()));
        return new ObjectLiteralNode(fields);
    }

    @SuppressWarnings("Duplicates")
    private ObjectLiteralNode getColObjectLiteralFromColTag(DLSParser.ColContext cc) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(cc.attributes(), colImplicitValues);
        fields.add(getTextField(cc.textArea()));
        return new ObjectLiteralNode(fields);
    }

    private List<StatementNode> getStatementNodes(DLSParser.StatementContext ctx) {
        if(ctx.emptyStatement() != null) return Collections.emptyList();
        //try get single statement node
        Node node = tryGetSingleStatementNode(ctx);
        if(node != null) return Collections.singletonList((StatementNode)node);
        List<StatementNode> nodes = tryGetMultipleStatementNodes(ctx);
        if(nodes != null) return nodes;
        //try get multiple statement node
        throw new RuntimeException("unsupported statement type");
    }

    /**
     * this is supposed to be used only by `getStatementNodes` methods.
     * tries to get a single statement node from the provided statement context.
     * The statement context can also result in multiple statement nodes. so this method
     * should be followed by a call of `tryGetMultipleStatementNodes`.
     * @param ctx statement context
     * @return a single statement node
     */
    private StatementNode tryGetSingleStatementNode(DLSParser.StatementContext ctx) {
        if (ctx.variableStatement() != null) return visitVariableStatement(ctx.variableStatement());
        if (ctx.expressionStatement() != null) return visitExpressionStatement(ctx.expressionStatement());
        if (ctx.ifStatement() != null) return visitIfStatement(ctx.ifStatement());
        if (ctx.functionDeclaration() != null) return visitFunctionDeclaration(ctx.functionDeclaration());
        if (ctx.returnStatement() != null) return visitReturnStatement(ctx.returnStatement());
        if (ctx.listOperationStatement() != null) return visitListOperationStatement(ctx.listOperationStatement());
        return null;
    }

    /**
     * this is supposed to be used only by `getStatementNodes` methods.
     * see `tryGetSingleStatementNode` for more details
     * @param ctx statement context
     * @return a list of statement nodes.
     */
    private List<StatementNode> tryGetMultipleStatementNodes(DLSParser.StatementContext ctx) {
        if (ctx.chanceStatement() != null) return getChanceStatementNodes(ctx.chanceStatement());
        if (ctx.builtInCommandStatement() != null) return visitBuiltInCommandStatement(ctx.builtInCommandStatement());
        return null;
    }

    private List<StatementNode> getStatementNodes(DLSParser.StatementsContext ctx) {
        return ctx.statement().stream()
                .map(this::getStatementNodes)
                .flatMap(List::stream)
                .map(StatementNode.class::cast)
                .collect(Collectors.toList());
    }

    
    private StatementNode visitVariableStatement(DLSParser.VariableStatementContext ctx) {
        IdentifierNode name = new IdentifierNode(ctx.Identifier().getText());
        ExpressionNode initializer = visitExpression(ctx.initialiser().expression());
        boolean isGlobal = ctx.Global() != null;
        DefNode ret = new DefNode(isGlobal, name, initializer);
        if(needsTokenAssociation)ret.setToken(ctx.getStart());
        return ret;
    }

    
    private StatementNode visitExpressionStatement(DLSParser.ExpressionStatementContext ctx) {
        ExpressionStatementNode est = new ExpressionStatementNode(visitExpression(ctx.expression()));
        if(needsTokenAssociation) est.setToken(ctx.getStart());
        return est;
    }

    private ExpressionNode visitExpression(DLSParser.ExpressionContext ctx) {
        if (ctx instanceof DLSParser.MemberExpressionContext) {
            return visitMemberExpression((DLSParser.MemberExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.CallExpressionContext) {
            return visitCallExpression((DLSParser.CallExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.NotExpressionContext) {
            return visitNotExpression((DLSParser.NotExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.MultiplicativeExpressionContext) {
            return visitMultiplicativeExpression((DLSParser.MultiplicativeExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.AdditiveExpressionContext) {
            return visitAdditiveExpression((DLSParser.AdditiveExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.RelationalExpressionContext) {
            return visitRelationalExpression((DLSParser.RelationalExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.EqualityExpressionContext) {
            return visitEqualityExpression((DLSParser.EqualityExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.LogicalAndExpressionContext) {
            return visitLogicalAndExpression((DLSParser.LogicalAndExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.LogicalOrExpressionContext) {
            return visitLogicalOrExpression((DLSParser.LogicalOrExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.AssignmentExpressionContext) {
            return visitAssignmentExpression((DLSParser.AssignmentExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.IdentifierExpressionContext) {
            return visitIdentifierExpression((DLSParser.IdentifierExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.LiteralExpressionContext) {
            return visitLiteralExpression((DLSParser.LiteralExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.RowLiteralExpressionContext) {
            return visitRowLiteralExpression((DLSParser.RowLiteralExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.ColumnLiteralExpressionContext) {
            return visitColumnLiteralExpression((DLSParser.ColumnLiteralExpressionContext) ctx);
        } else if (ctx instanceof DLSParser.ParenthesizedExpressionContext) {
            //must be instance ParenthesizedExpression
            return visitParenthesizedExpression((DLSParser.ParenthesizedExpressionContext) ctx);
        }
        throw new RuntimeException("unsupported expression");
    }

    
    private ExpressionNode visitParenthesizedExpression(DLSParser.ParenthesizedExpressionContext ctx) {
        return visitExpression(ctx.expression());
    }


    private ExpressionNode visitColumnLiteralExpression(DLSParser.ColumnLiteralExpressionContext ctx) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(ctx.colLiteral().attributes(), colImplicitValues);
        fields.add(getColTypeField());
        fields.add(getTextField(ctx.colLiteral().scriptTextArea()));
        return new ObjectLiteralNode(fields);
    }


    private ExpressionNode visitRowLiteralExpression(DLSParser.RowLiteralExpressionContext ctx) {
        List<ObjectLiteralNode.Field> fields = getObjectLiteralFieldsFromAttributes(ctx.rowLiteral().attributes(), rowImplicitValues);
        fields.add(getRowTypeField());
        fields.add(getTextField(ctx.rowLiteral().scriptTextArea()));
        return new ObjectLiteralNode(fields);
    }

    private List<ObjectLiteralNode.Field> getObjectLiteralFieldsFromAttributes(DLSParser.AttributesContext ac, Map<String, String> implicitValues) {
        return ac.attribute().stream().map(attrb -> {
            if (attrb instanceof DLSParser.AttributeWithAssignedStringValueContext) {
                DLSParser.AttributeWithAssignedStringValueContext c = (DLSParser.AttributeWithAssignedStringValueContext) attrb;
                String fieldName = c.Name().getText();
                String val = removeDoubleQuotes(c.String().getText());
                return new ObjectLiteralNode.Field(fieldName, new StringNode(val));
            } else if (attrb instanceof DLSParser.AttributeWithAssignedExpressionContext) {
                DLSParser.AttributeWithAssignedExpressionContext c = (DLSParser.AttributeWithAssignedExpressionContext) attrb;
                String fieldName = c.Name().getText();
                ExpressionNode exp = visitExpression(c.expression());
                return new ObjectLiteralNode.Field(fieldName, exp);
            } else {
                DLSParser.AttributeWithDefaultValueContext c = (DLSParser.AttributeWithDefaultValueContext) attrb;
                String fieldName = c.Name().getText();
                String val = implicitValues.get(fieldName);
                return new ObjectLiteralNode.Field(fieldName, new StringNode(val));
            }
        }).collect(Collectors.toList());
    }

    
    private ExpressionNode visitAdditiveExpression(DLSParser.AdditiveExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        if (ctx.Minus() != null) {
            return new MinusNode(left, right);
        } else {
            return new AddNode(left, right);
        }
    }


    private ExpressionNode visitRelationalExpression(DLSParser.RelationalExpressionContext ctx) {
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


    private ExpressionNode visitLogicalAndExpression(DLSParser.LogicalAndExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new AndNode(left, right);
    }


    private ExpressionNode visitLiteralExpression(DLSParser.LiteralExpressionContext ctx) {
        //here we do not have object literal cos user cannot define objects.
        DLSParser.LiteralContext lctx = ctx.literal();
        if (lctx instanceof DLSParser.DecimalLiteralContext) {
            double d = Double.valueOf(lctx.getText());
            return new NumberNode(d);
        } else if (lctx instanceof DLSParser.BooleanLiteralContext) {
            String isTrue = lctx.getText();
            return new BooleanNode(Boolean.valueOf(isTrue));
        } else if (lctx instanceof DLSParser.StringLiteralContext) {
            String str = lctx.getText();
            return new StringNode(removeDoubleQuotes(str));
        } else if (lctx instanceof DLSParser.HoursLiteralContext) {
            DLSParser.HoursLiteralContext hcx = (DLSParser.HoursLiteralContext)lctx;
            int hours = hcx.Hours() != null ? removeLastCharacter(hcx.Hours().getText()) : 0;
            int minutes = hcx.Minutes() != null ? removeLastCharacter(hcx.Minutes().getText()) : 0;
            int seconds = hcx.Seconds() != null ? removeLastCharacter(hcx.Seconds().getText()) : 0;
            int totalMilliseconds = hours * 60 * 60 * 1000
                    + minutes * 60 * 1000
                    + seconds * 1000;
            return new NumberNode(totalMilliseconds);
        } else if (lctx instanceof DLSParser.MinutesLiteralContext) {
            DLSParser.MinutesLiteralContext mcx = (DLSParser.MinutesLiteralContext)lctx;
            int minutes = mcx.Minutes() != null ? removeLastCharacter(mcx.Minutes().getText()) : 0;
            int seconds = mcx.Seconds() != null ? removeLastCharacter(mcx.Seconds().getText()) : 0;
            int totalMilliseconds = minutes * 60 * 1000 + seconds * 1000;
            return new NumberNode(totalMilliseconds);
        } else if (lctx instanceof DLSParser.SecondsLiteralContext) {
            DLSParser.SecondsLiteralContext mcx = (DLSParser.SecondsLiteralContext)lctx;
            int seconds = removeLastCharacter(mcx.Seconds().getText());
            int totalMilliseconds = seconds * 1000;
            return new NumberNode(totalMilliseconds);
        } else if (lctx instanceof DLSParser.ClockUnitLiteralContext) {
            String t = lctx.getText();
            return convertClockUnitStringToNumber(t);
        }
        throw new RuntimeException("unsupported literal type");
    }

    private int removeLastCharacter(String str) {
        String t = str.substring(0, str.length() - 1);
        return Integer.valueOf(t);
    }

    private NumberNode convertClockUnitStringToNumber(String t){
        int c;
        switch (t) {
            case "12am":
                c = 0;
                break;
            case "12pm":
                c = 12;
                break;
            default:
                String n = t.substring(0, t.length() - 2);
                String s = t.substring(t.length() - 2);
                switch (s) {
                    case "am":
                        c = Integer.valueOf(n);
                        break;
                    case "pm":
                        c = Integer.valueOf(n) + 12;
                        break;
                    default:
                        throw new RuntimeException("unknown clock unit suffix");
                }
        }
        return new NumberNode(c);
    }


    private List<ExpressionNode> convertExpressionContextsToExpressionNodes(Collection<DLSParser.ExpressionContext> ctxs) {
        return ctxs.stream()
                .map(this::visitExpression)
                .collect(Collectors.toList());
    }


    private ExpressionNode visitLogicalOrExpression(DLSParser.LogicalOrExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new OrNode(left, right);
    }


    private ExpressionNode visitNotExpression(DLSParser.NotExpressionContext ctx) {
        ExpressionNode target = visitExpression(ctx.expression());
        return new NotNode(target);
    }


    private ExpressionNode visitIdentifierExpression(DLSParser.IdentifierExpressionContext ctx) {
        return new IdentifierNode(ctx.getText());
    }


    private ExpressionNode visitMemberExpression(DLSParser.MemberExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression());
        IdentifierNode right = new IdentifierNode(ctx.Identifier().getText());
        return new DotNode(left, right);
    }

    
    private ExpressionNode visitAssignmentExpression(DLSParser.AssignmentExpressionContext ctx) {
        ExpressionNode target = visitExpression(ctx.expression(0));
        ExpressionNode value = visitExpression(ctx.expression(1));
        return new AssignNode(target, value);
    }

    
    private ExpressionNode visitEqualityExpression(DLSParser.EqualityExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new EqualsNode(left, right);
    }

    
    private ExpressionNode visitMultiplicativeExpression(DLSParser.MultiplicativeExpressionContext ctx) {
        ExpressionNode left = visitExpression(ctx.expression(0));
        ExpressionNode right = visitExpression(ctx.expression(1));
        return new MultiplyNode(left, right);
    }

    
    private ExpressionNode visitCallExpression(DLSParser.CallExpressionContext ctx) {
        DLSParser.ExpressionContext e = ctx.expression();
        List<ExpressionNode> args;
        if (ctx.argumentList().expression() != null) {
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

    
    private StatementNode visitIfStatement(DLSParser.IfStatementContext ctx) {
        List<IfElseNode.Branch> branches = new ArrayList<>();
        createBranchFromNoEndingIfStatement(ctx.noEndingIfStatement(), branches);
        return new IfElseNode(branches);
    }

    //read the ifStatement rule in the parser rule otherwise it would be very difficult to understand the code here.
    private void createBranchFromNoEndingIfStatement(DLSParser.NoEndingIfStatementContext ctx, List<IfElseNode.Branch> branches) {
        ExpressionNode condition = visitExpression(ctx.expression());
        List<StatementNode> statements = createListOfStatementNodes(ctx.statements());
        IfElseNode.Branch branch = new IfElseNode.Branch(condition, statements);
        if(needsTokenAssociation) branch.setToken(ctx.expression().getStart());
        branches.add(branch);

        if (ctx.elseStatement() == null) return;

        if (ctx.elseStatement().noEndingIfStatement() != null) {
            createBranchFromNoEndingIfStatement(ctx.elseStatement().noEndingIfStatement(), branches);
        } else {
            //create the catch all "else statement" in the end.
            ExpressionNode alwaysTrue = new BooleanNode(true);
            List<StatementNode> lastBranchStatements = createListOfStatementNodes(ctx.elseStatement().statements());
            /*
                in this case it is like the final else statement, from user point of view it does not really
                have a condition. The condition we have here is a hidden generated condition that always evaluates
                to true. We do not want to stop at this condition.
             */
            IfElseNode.Branch lastBranch = new IfElseNode.Branch(alwaysTrue, lastBranchStatements);
            branches.add(lastBranch);
        }
    }

    private List<StatementNode> createListOfStatementNodes(DLSParser.StatementsContext ctx) {
        return ctx.statement()
                .stream()
                .map(this::getStatementNodes)
                .flatMap(List::stream)
                .map(StatementNode.class::cast)
                .collect(Collectors.toList());
    }

    
    private StatementNode visitFunctionDeclaration(DLSParser.FunctionDeclarationContext ctx) {
        String functionName = ctx.Identifier().getText();
        IdentifierNode funcIdentifier = new IdentifierNode(functionName);
        List<String> argNames = ctx.formalArgumentList().Identifier()
                .stream()
                .map(TerminalNode::getText)
                .collect(Collectors.toList());
        List<StatementNode> statements = ctx.functionBody().statement().stream()
                .map(this::getStatementNodes)
                .flatMap(List::stream)
                .map(StatementNode.class::cast)
                .collect(Collectors.toList());
        FuncDefNode ret = new FuncDefNode(funcIdentifier, argNames, statements);
        if(needsTokenAssociation) ret.setToken(ctx.getStart());
        return ret;
    }

    
    private StatementNode visitReturnStatement(DLSParser.ReturnStatementContext ctx) {
        Optional<ExpressionNode> maybeRetVal = Optional.ofNullable(ctx.expression()).map(this::visitExpression);
        ReturnNode ret = new ReturnNode(maybeRetVal.orElse(null));
        if(needsTokenAssociation)ret.setToken(ctx.getStart());
        return ret;
    }

    
    private StatementNode visitListOperationStatement(DLSParser.ListOperationStatementContext ctx) {
        ListOptNode.ListOptType optType;
        if(ctx.Each() != null) {
            optType = ListOptNode.ListOptType.LOOP;
        } else if (ctx.Map() != null) {
            optType = ListOptNode.ListOptType.MAP;
        } else if (ctx.Filter() != null) {
            optType = ListOptNode.ListOptType.FILTER;
        } else {
            throw new RuntimeException("unsupported list operation");
        }

        IdentifierNode identifier = new IdentifierNode(ctx.Identifier().getText());

        List<StatementNode> statements = getStatementNodes(ctx.statements());
        ListOptNode ret = new ListOptNode(optType, identifier, statements);
        //we want to be able to stop at the first line of a map/reduce/filter so that we do not even need to get into the statements inside to stop.
        if(needsTokenAssociation)ret.setToken(ctx.getStart());
        return ret;
    }

    private List<StatementNode> getChanceStatementNodes(DLSParser.ChanceStatementContext ctx) {
        //todo: semantic checking, all percentages sum needs to be smaller than 100
        List<StatementNode> statements = new LinkedList<>();

        //get a random number
        //inclusive
        NumberNode randomNumberLowerBound = new NumberNode(1);
        //exclusive
        NumberNode randomNumberHigherBound = new NumberNode(101);
        List<ExpressionNode> getRandomNumberArguments = new LinkedList<>();
        getRandomNumberArguments.add(randomNumberLowerBound);
        getRandomNumberArguments.add(randomNumberHigherBound);
        CallNode getRandomNumberCall = new CallNode(
                new IdentifierNode(GetRandomNumber.getFuncName()),
                getRandomNumberArguments);

        IdentifierNode randomNumberIdentifier = new IdentifierNode(generateRandomIdentifierName("randomNumber"));
        DefNode defRandomNumber = new DefNode(randomNumberIdentifier, getRandomNumberCall);

        statements.add(defRandomNumber);

        List<IfElseNode.Branch> branches = new LinkedList<>();
        int i = 0;
        for(DLSParser.PossibilityContext possibility : ctx.possibility()) {
            int p = getPercentageVal(possibility.Percentage().getText());
            //inclusive
            int lowBound = i + 1;
            //inclusive
            int highBound = i + p;
            i = highBound;
            MoreThanEqualsNode t1 = new MoreThanEqualsNode(randomNumberIdentifier, new NumberNode(lowBound));
            LessThanEqualsNode t2 = new LessThanEqualsNode(randomNumberIdentifier, new NumberNode(highBound));
            AndNode t3 = new AndNode(t1, t2);
            List<StatementNode> branchStatements = getStatementNodes(possibility.statements());
            /*
                here we do not associate token to branch because we dont want to stop on condition.
                we can still stop on a statement inside the branch. When those statement nodes can generated,
                appropriate tokens will be associated with those statement nodes. Please see the comments for
                `getToken` method of IfElseNode.Branch
             */
            branches.add(new IfElseNode.Branch(t3, branchStatements));
        }

        IfElseNode ifElseNode =  new IfElseNode(branches);
        statements.add(ifElseNode);

        return statements;
    }

    private List<StatementNode> visitBuiltInCommandStatement(DLSParser.BuiltInCommandStatementContext ctx) {
        if(ctx instanceof DLSParser.TerminateCommandContext) {
            EndSurveyNode end = new EndSurveyNode();
            if(needsTokenAssociation)end.setToken(ctx.getStart());
            return Collections.singletonList(end);
        } else if (ctx instanceof DLSParser.SelectCommandContext) {
            DLSParser.SelectCommandContext scc = (DLSParser.SelectCommandContext)ctx;
            ExpressionNode left = visitExpression(scc.expression());
            DotNode answerIsSelected = new DotNode(left, AnswerFields.IsSelected.getName());
            AssignNode setAnswerToBeSelected = new AssignNode(answerIsSelected, new BooleanNode(true));
            ExpressionStatementNode select = new ExpressionStatementNode(setAnswerToBeSelected);
            if(needsTokenAssociation)select.setToken(ctx.getStart());
            return Collections.singletonList(select);
        } else if (ctx instanceof DLSParser.RankCommandContext) {
            DLSParser.RankCommandContext rcc = (DLSParser.RankCommandContext)ctx;
            List<DLSParser.ExpressionContext> ecs = rcc.rankOrders().expression();
            int rank = 1;
            List<StatementNode> statementNodes = new LinkedList<>();
            for(DLSParser.ExpressionContext ec : ecs) {
                ExpressionNode left = visitExpression(ec);
                DotNode answerRank = new DotNode(left, AnswerFields.Rank.getName());
                AssignNode setAnswerRank = new AssignNode(answerRank, new NumberNode(rank++));
                statementNodes.add(new ExpressionStatementNode(setAnswerRank));
            }
            /*
                a single rank row1 -> row2 -> row3 is broken into three statements:
                row1.rank = 1
                row2.rank = 2
                row3.rank = 3
                although its actually three statements, from user point of view it is only a single command,
                therefore we should only have one stop here.
                we choose to stop at the first generated statement. When we stop at the first statement, it is
                effectively the same as stop at the "single" command (before any rank is assigned). If we stop at the
                second generated statement, by the time we stop we have already set the rank of the first row1. But
                from user point of view, when he stop the command, the entire commands has not been executed yet.
             */
            if(needsTokenAssociation)
                //parser syntax gurantee that there will at least be one statement here.
                ((ExpressionStatementNode)statementNodes.get(0)).setToken(ctx.getStart());
            return statementNodes;
        } else if (ctx instanceof DLSParser.PrintCommandContext) {
            ExpressionNode exp = visitExpression(((DLSParser.PrintCommandContext) ctx).expression());
            CallNode callBuiltInPrintFunction = new CallNode(BuiltInFuncNames.PRINT.getFuncName(), exp);
            ExpressionStatementNode statementNode = new ExpressionStatementNode(callBuiltInPrintFunction);
            if(needsTokenAssociation) statementNode.setToken(ctx.getStart());
            return Collections.singletonList(statementNode);
        }
        throw new RuntimeException("unsupported built in command");
    }

    private int getPercentageVal(String str) {
        //remove the suffix symbol %.
        return Integer.valueOf(str.substring(0, str.length() - 1));
    }

    private String removeDoubleQuotes(String str) {
        if (str.charAt(0) == '"' && str.charAt(str.length() - 1) == '"') {
            return str.substring(1, str.length() - 1);
        } else {
            return str;
        }
    }

    private Optional<String> getIdStrVal(DLSParser.AttributesContext ctx) {
        return ctx.attribute()
                .stream()
                .filter(DLSParser.AttributeWithAssignedStringValueContext.class::isInstance)
                .map(DLSParser.AttributeWithAssignedStringValueContext.class::cast)
                .filter(strValAttr -> strValAttr.Name().getText().equals(PageAttributes.ID.getName()))
                .map(strValAttr -> strValAttr.String().getText())
                .map(this::removeDoubleQuotes)
                .findFirst();
    }

    private static class OrderedExpressionNode {
        final int order;
        final ExpressionNode exp;

        OrderedExpressionNode(int order, ExpressionNode exp) {
            this.order = order;
            this.exp = exp;
        }
    }

    private ObjectLiteralNode.Field getTextField(DLSParser.TextAreaContext textAreaContext) {
        List<OrderedExpressionNode> t1 = textAreaContext.TextArea().stream().map(ctx -> {
            int order = ctx.getSymbol().getStartIndex();
            ExpressionNode exp = new StringNode(ctx.getText());
            return new OrderedExpressionNode(order, exp);
        }).collect(Collectors.toList());

        List<OrderedExpressionNode> t2 = textAreaContext.expression().stream().map(ctx -> {
            int order = ctx.getStart().getStartIndex();
            ExpressionNode exp = visitExpression(ctx);
            return new OrderedExpressionNode(order, exp);
        }).collect(Collectors.toList());

        t2.addAll(t1);
        return getTextField(t2);
    }

    private ObjectLiteralNode.Field getTextField(DLSParser.ScriptTextAreaContext scriptTextAreaContext) {
        List<OrderedExpressionNode> t1 = scriptTextAreaContext.ScriptTextArea().stream().map(ctx -> {
            int order = ctx.getSymbol().getStartIndex();
            ExpressionNode exp = new StringNode(ctx.getText());
            return new OrderedExpressionNode(order, exp);
        }).collect(Collectors.toList());

        List<OrderedExpressionNode> t2 = scriptTextAreaContext.expression().stream().map(ctx -> {
            int order = ctx.getStart().getStartIndex();
            ExpressionNode exp = visitExpression(ctx);
            return new OrderedExpressionNode(order, exp);
        }).collect(Collectors.toList());

        t2.addAll(t1);
        return getTextField(t2);
    }

    private ObjectLiteralNode.Field getTextField(List<OrderedExpressionNode> orderedExpressionNodes) {
        orderedExpressionNodes.sort(Comparator.comparingInt(o -> o.order));
        if(orderedExpressionNodes.size() == 1) {
            return new ObjectLiteralNode.Field("text", orderedExpressionNodes.get(0).exp);
        } else if(orderedExpressionNodes.size() == 2) {
            AddNode add = new AddNode(orderedExpressionNodes.get(0).exp, orderedExpressionNodes.get(1).exp);
            return new ObjectLiteralNode.Field("text", add);
        } else {
            AddNode add = new AddNode(orderedExpressionNodes.get(0).exp, orderedExpressionNodes.get(1).exp);
            for(int i = 2; i < orderedExpressionNodes.size(); i++) {
                add = new AddNode(add, orderedExpressionNodes.get(i).exp);
            }
            return new ObjectLiteralNode.Field("text", add);
        }
    }
}
