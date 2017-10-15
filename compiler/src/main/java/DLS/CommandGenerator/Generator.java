package DLS.CommandGenerator;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.*;
import DLS.ASTNodes.statement.built.in.commands.EndSurveyNode;
import DLS.ASTNodes.statement.built.in.commands.ReceiveDataBlockingNode;
import DLS.ASTNodes.statement.built.in.commands.SendDataNode;
import DLS.ASTNodes.statement.expression.*;
import DLS.ASTNodes.statement.expression.literal.BooleanNode;
import DLS.ASTNodes.statement.expression.literal.NumberNode;
import DLS.ASTNodes.statement.expression.literal.ObjectLiteralNode;
import DLS.ASTNodes.statement.expression.literal.StringNode;
import DLS.ASTNodes.statement.expression.logical.*;
import DLS.ASTNodes.statement.expression.math.*;
import DLS.ASTNodes.statement.expression.relational.LessThanEqualsNode;
import DLS.ASTNodes.statement.expression.relational.LessThanNode;
import DLS.ASTNodes.statement.expression.relational.MoreThanEqualsNode;
import DLS.ASTNodes.statement.expression.relational.MoreThanNode;
import DLS.CommandGenerator.commands.flow.*;
import DLS.CommandGenerator.commands.function.*;
import DLS.CommandGenerator.commands.object.CDup;
import DLS.CommandGenerator.commands.stack.*;
import DLS.CommandGenerator.commands.math.*;
import DLS.CommandGenerator.commands.object.CNew;
import DLS.CommandGenerator.commands.object.CPutField;
import DLS.CommandGenerator.commands.object.CReadField;
import DLS.CommandGenerator.commands.flow.CCmpge;
import DLS.CommandGenerator.commands.flow.CCmpgt;
import DLS.CommandGenerator.commands.flow.CCmple;
import DLS.CommandGenerator.commands.flow.CCmplt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static DLS.CommandGenerator.Command.NO_LINE_NUMBER;

//todo: global variable should be stored in global variable space.
public class Generator {

    private final static String LOOP_INDEX = "$index";
    private final static String LOOP_ELEMENT = "$element";

    private List<String> stringConstants = new ArrayList<>();

    public Result getCommands(List<StatementNode> statements) {
        List<Command> cs = statements.stream()
                .map(this::generate)
                .flatMap(List::stream)
                .collect(Collectors.toList());
        if(cs.isEmpty()) return new Result(Collections.EMPTY_LIST, Collections.EMPTY_LIST);
        Command lastCommand = cs.get(cs.size() - 1);
        if(!(lastCommand instanceof CEnd)) cs.add(new CEnd());
        setIndex(cs);
        setBranchIndex(cs);
        List<String> cmms = cs.stream().map(Command::print).collect(Collectors.toList());
        return new Result(stringConstants, cmms);
    }

    private void setIndex(List<Command> cs) {
        for(int i = 0; i < cs.size(); i++) {
            cs.get(i).setIndex(i);
        }
    }

    private void setBranchIndex(List<Command> cs) {
        cs.stream().filter(SetBranchIndex.class::isInstance)
                .map(SetBranchIndex.class::cast)
                .forEach(SetBranchIndex::setBranchIndex);
    }

    private List<Command> generate(List<StatementNode> statements) {
        return statements.stream().map(this::generate)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    private List<Command> generate(StatementNode statement) {
        if (statement instanceof DefNode) {
            return generate((DefNode) statement);
        } else if (statement instanceof ExpressionStatementNode) {
            return generate((ExpressionStatementNode) statement);
        } else if (statement instanceof FuncDefNode) {
            return generate((FuncDefNode) statement);
        } else if (statement instanceof IfElseNode) {
            return generate((IfElseNode) statement);
        } else if (statement instanceof ListOptNode) {
            return generate((ListOptNode) statement);
        } else if (statement instanceof ReturnNode) {
            return generate((ReturnNode) statement);
        } else if (statement instanceof EndSurveyNode) {
            return generateEndSurveyCommand();
        } else if (statement instanceof SendDataNode) {
            return generate((SendDataNode) statement);
        } else if (statement instanceof ReceiveDataBlockingNode) {
            return generateAwaitCommand();
        }
        throw new RuntimeException("unsupported statement type");
    }

    private List<Command> generate(DefNode defNode) {
        List<Command> commands = new LinkedList<>();
        int lineNumber = getLineNumber(defNode);
        if (defNode.getInitializer().isPresent()) {
            commands.addAll(generate(defNode.getInitializer().get()));
        } else {
            commands.add(new CNull());
        }
        if(defNode.isGlobal()) {
            CGstore gStore = new CGstore(defNode.getIdentifier().name);
            commands.add(gStore);
        } else {
            CStore store = new CStore(defNode.getIdentifier().name);
            commands.add(store);
        }

        /*
            set line number to all related commands. when we stop at an variable definition, we do not want
            any part of the definition to run, including initialization expression.
         */
        setLineNumberForCommands(commands, lineNumber);
        return commands;
    }

    private List<Command> generate(ExpressionStatementNode esn) {
        int lineNumber = getLineNumber(esn);
        List<Command> commands = generate(esn.getExp());
        setLineNumberForCommands(commands, lineNumber);
        return commands;
    }

    private List<Command> generate(FuncDefNode fd) {
        List<Command> commands = new LinkedList<>();
        CDefFunc defineCommand = new CDefFunc();

        defineCommand.setFirstOperand(fd.getName().name);
        //we wait when all commands are ready then we find out all function def nodes and set their start index.
        defineCommand.setThirdOperand(String.valueOf(fd.getArgumentList().size()));
        defineCommand.setLineNumber(getLineNumber(fd));
        commands.add(defineCommand);

        //skip the executions commands and go to end, we are not calling the function now.
        CGoTo gotoCommand = new CGoTo();
        commands.add(gotoCommand);

        //vm will create a new call stack
        //vm should record the caller's return index
        //vm will transfer all parameters from caller's stack to the new call stack
        //during transfer vm should check whether the number of parameters is correct
        List<Command> executions = fd.getArgumentList().stream().map(CStore::new).collect(Collectors.toList());
        executions.addAll(generate(fd.getStatements()));
        commands.addAll(executions);

        //executions size is at least one because we always generate a return command
        defineCommand.setExecutionStart(executions.get(0));

        CEmpty skipExecutionPoint = new CEmpty();
        commands.add(skipExecutionPoint);
        gotoCommand.setGoToCommand(skipExecutionPoint);
        return commands;
    }

    private List<Command> generate(IfElseNode ien) {
        List<Command> commands = new ArrayList<>();
        CEmpty last = new CEmpty();
        CIfeq prevCmp = null;
        for (IfElseNode.Branch branch : ien.getBranches()) {
            List<Command> branchConditionCommands = generate(branch.getCondition());
            setLineNumberForCommands(branchConditionCommands, getLineNumber(branch));
            List<Command> branchStatementCommands = generate(branch.getStatements());
            CIfeq cmp = new CIfeq();
            if (prevCmp != null) prevCmp.setBranchIfEqualsZero(branchConditionCommands.get(0));
            prevCmp = cmp;
            CGoTo cGoTo = new CGoTo();
            cGoTo.setGoToCommand(last);
            commands.addAll(branchConditionCommands);
            commands.add(cmp);
            commands.addAll(branchStatementCommands);
            commands.add(cGoTo);
        }
        if (prevCmp == null) throw new RuntimeException("maybe if else statement is missing a branch?");
        if (prevCmp.getBranchIfEqualsZero() == null) prevCmp.setBranchIfEqualsZero(last);
        commands.add(last);
        return commands;
    }

    private List<Command> generate(ListOptNode lon) {
        List<Command> commands = new ArrayList<>();
        /*
            example:
            some commands generated from statements before the loop
            newScope
            stack 0
            store $index
            load $index                     #3
            load arr_ref
            readField size
            cmpge   #closeScope
            inc $index
            load arr_ref
            load $index
            aload
            store $element
            .....
            commands generated from body statement of the loop.
            .....
            goTo #3
            closeScope                      #closeScope
            some commands generated from statements after the loop
         */
        CEmpty start = new CEmpty();
        start.setLineNumber(getLineNumber(lon));
        commands.add(new CNewScope());
        commands.add(new CNumber(0));
        commands.add(new CStore(LOOP_INDEX));
        CLoad load = new CLoad(LOOP_INDEX);
        commands.add(load);
        commands.add(new CLoad(lon.getListName().name));
        commands.add(new CReadField("size"));
        CCmpge cmpge = new CCmpge();
        commands.add(cmpge);
        commands.add(new CLoad(lon.getListName().name));
        commands.add(new CLoad(LOOP_INDEX));
        commands.add(new CALoad());
        commands.add(new CStore(LOOP_ELEMENT));

        commands.addAll(generate(lon.getStatements()));

        commands.add(new CInc(LOOP_INDEX));
        CGoTo goTo = new CGoTo();
        goTo.setGoToCommand(load);
        commands.add(goTo);
        CCloseScope closeScope = new CCloseScope();
        cmpge.setBranchIfGreaterThanEquals(closeScope);
        commands.add(closeScope);
        return commands;
    }

    private List<Command> generate(ReturnNode ret) {
        List<Command> commands = new ArrayList<>();
        if (ret.getReturnValue().isPresent()) {
            commands.addAll(generate(ret.getReturnValue().get()));
            commands.add(new CReturnVal());
        } else {
            commands.add(new CReturnNull());
        }
        return commands;
    }

    /**
     * generate commands for a expression
     *
     * @param exp expression node
     */
    private List<Command> generate(ExpressionNode exp) {
        if (exp instanceof AddNode) {
            //math category
            return generate((AddNode) exp);
        } else if (exp instanceof DivideNode) {
            return generate((DivideNode) exp);
        } else if (exp instanceof MinusNode) {
            return generate((MinusNode) exp);
        } else if (exp instanceof ModulusNode) {
            return generate((ModulusNode) exp);
        } else if (exp instanceof MultiplyNode) {
            return generate((MultiplyNode) exp);
        } else if (exp instanceof AndNode) {
            //logical category
            return generate((AndNode) exp);
        } else if (exp instanceof EqualsNode) {
            return generate((EqualsNode) exp);
        } else if (exp instanceof NotEqualsNode) {
            return generate((NotEqualsNode) exp);
        } else if (exp instanceof NotNode) {
            return generate((NotNode) exp);
        } else if (exp instanceof OrNode) {
            return generate((OrNode) exp);
        } else if (exp instanceof BooleanNode) {
            //literal category
            return generate((BooleanNode) exp);
        } else if (exp instanceof NumberNode) {
            return generate((NumberNode) exp);
        } else if (exp instanceof ObjectLiteralNode) {
            return generate((ObjectLiteralNode) exp);
        } else if (exp instanceof StringNode) {
            return generate((StringNode) exp);
        } else if (exp instanceof LessThanEqualsNode) {
            //relational category
            return generate((LessThanEqualsNode) exp);
        } else if (exp instanceof LessThanNode) {
            return generate((LessThanNode) exp);
        } else if (exp instanceof MoreThanEqualsNode) {
            return generate((MoreThanEqualsNode) exp);
        } else if (exp instanceof MoreThanNode) {
            return generate((MoreThanNode) exp);
        } else if (exp instanceof AssignNode) {
            return generate((AssignNode) exp);
        } else if (exp instanceof CallNode) {
            return generate((CallNode) exp);
        } else if (exp instanceof DotNode) {
            return generate((DotNode) exp);
        } else if (exp instanceof IdentifierNode) {
            return generate((IdentifierNode) exp);
        }
        throw new RuntimeException("not supported expression node type");
    }

    private List<Command> generate(AddNode exp) {
        List<Command> cs = new ArrayList<>();
        cs.addAll(generate(exp.getLeft()));
        cs.addAll(generate(exp.getRight()));
        cs.add(new CAdd());
        return cs;
    }

    private List<Command> generate(MinusNode exp) {
        List<Command> cs = new ArrayList<>();
        cs.addAll(generate(exp.getLeft()));
        cs.addAll(generate(exp.getRight()));
        cs.add(new CSub());
        return cs;
    }

    private List<Command> generate(ModulusNode exp) {
        List<Command> cs = new ArrayList<>();
        cs.addAll(generate(exp.getLeft()));
        cs.addAll(generate(exp.getRight()));
        cs.add(new CMod());
        return cs;
    }

    private List<Command> generate(MultiplyNode exp) {
        List<Command> cs = new ArrayList<>();
        cs.addAll(generate(exp.getLeft()));
        cs.addAll(generate(exp.getRight()));
        cs.add(new CMul());
        return cs;
    }

    private List<Command> generate(DivideNode exp) {
        List<Command> cs = new ArrayList<>();
        cs.addAll(generate(exp.getLeft()));
        cs.addAll(generate(exp.getRight()));
        cs.add(new CDiv());
        return cs;
    }

    private List<Command> generate(AndNode exp) {
        List<Command> cs = new ArrayList<>();
        List<Command> lefts = generate(exp.getLeft());
        CIfeq ifLeftFalseReturnFalse = new CIfeq();
        List<Command> rights = generate(exp.getRight());
        CIfeq ifRightFalseReturnFalse = new CIfeq();
        CNumber isTrue = new CNumber(true);
        CGoTo goToEnd = new CGoTo();
        CNumber isFalse = new CNumber(false);
        CEmpty end = new CEmpty();

        ifLeftFalseReturnFalse.setBranchIfEqualsZero(isFalse);
        ifRightFalseReturnFalse.setBranchIfEqualsZero(isFalse);
        goToEnd.setGoToCommand(end);

        cs.addAll(lefts);
        cs.add(ifLeftFalseReturnFalse);
        cs.addAll(rights);
        cs.add(ifRightFalseReturnFalse);
        cs.add(isTrue);
        cs.add(goToEnd);
        cs.add(isFalse);
        cs.add(end);

        return cs;
    }

    private List<Command> generate(OrNode exp) {
        List<Command> cs = new ArrayList<>();

        List<Command> lefts = generate(exp.getLeft());
        CIfne ifLeftTrueReturnTrue = new CIfne();
        List<Command> rights = generate(exp.getRight());
        CIfeq ifRightFalseReturnFalse = new CIfeq();
        CNumber isTrue = new CNumber(true);
        CGoTo goToEnd = new CGoTo();
        CNumber isFalse = new CNumber(false);
        CEmpty end = new CEmpty();

        ifLeftTrueReturnTrue.setBranchIfNotEqualsZero(isTrue);
        ifRightFalseReturnFalse.setBranchIfEqualsZero(isFalse);
        goToEnd.setGoToCommand(end);

        cs.addAll(lefts);
        cs.add(ifLeftTrueReturnTrue);
        cs.addAll(rights);
        cs.add(ifRightFalseReturnFalse);
        cs.add(isTrue);
        cs.add(goToEnd);
        cs.add(isFalse);
        cs.add(end);

        return cs;
    }

    private List<Command> generate(CompareAndBranch cab, List<Command> lefts, List<Command> rights) {
        List<Command> cs = new ArrayList<>();
        CNumber isFalse = new CNumber(false);
        CGoTo goToEnd = new CGoTo();
        CNumber isTrue = new CNumber(true);
        CEmpty end = new CEmpty();

        cab.setBranch(isTrue);
        goToEnd.setGoToCommand(end);

        cs.addAll(lefts);
        cs.addAll(rights);
        cs.add(cab);
        cs.add(isFalse);
        cs.add(goToEnd);
        cs.add(isTrue);
        cs.add(end);

        return cs;
    }

    private List<Command> generate(EqualsNode exp) {
        List<Command> lefts = generate(exp.getLeft());
        List<Command> rights = generate(exp.getRight());
        CCmpeq eq = new CCmpeq();
        return generate(eq, lefts, rights);
    }

    private List<Command> generate(NotEqualsNode exp) {
        List<Command> lefts = generate(exp.getLeft());
        List<Command> rights = generate(exp.getRight());
        CCmpne ne = new CCmpne();
        return generate(ne, lefts, rights);
    }

    private List<Command> generate(NotNode exp) {
        List<Command> cs = new ArrayList<>();
        cs.addAll(generate(exp.getTarget()));
        cs.add(new CNeg());
        return cs;
    }

    private List<Command> generate(BooleanNode exp) {
        return Collections.singletonList(new CNumber(exp.isTrue()));
    }

    private List<Command> generate(NumberNode exp) {
        return Collections.singletonList(new CNumber(exp.getDecimal()));
    }

    private List<Command> generate(ObjectLiteralNode exp) {
        List<Command> cs = new ArrayList<>();
        /*
            here is an example:
            new command
            vm creates a empty object
            vm puts the reference of the object (#1) onto stack
            dup command
            vm duplicates #1 and puts the copy (#2) onto stack
            ...
            evaluate first field
            final result of first field evaluation (#3) put on stack
            ...
            set field command
            vm pops out #2 and #3 and set the field
            dup command
            vm duplicates #1 and puts the copy (#4) onto stack
            ...
            evaluate second field
            final result of second field evaluation (#5) put on stack
            ...
            set field command
            vm pops out #4 and #5 and set the field
            //finally #1 should remain on the stack.
         */
        cs.add(new CNew());
        cs.addAll(exp.getFields().stream().map(field -> {
            List<Command> setFieldCommands = new LinkedList<>();
            setFieldCommands.add(new CDup());
            setFieldCommands.addAll(generate(field.getValue()));
            setFieldCommands.add(new CPutField(field.getName()));
            return setFieldCommands;
        }).flatMap(List::stream).collect(Collectors.toList()));
        return cs;
    }

    private List<Command> generate(StringNode strNode) {
        int index = stringConstants.size();
        String str = strNode.getVal();
        //because of the lexer reason, we sometimes gets an extra \n
        if(str.endsWith("\n")) str = str.substring(0, str.length() - 1);
        //escape line breaks because we want each string to be on a single line in the generated result.
        str = str.replaceAll("\n", "");
        str = str.replaceAll("\r", "");
        str = "\"" + str + "\"";
        stringConstants.add(str);
        return Collections.singletonList(new CString(index));
    }

    private List<Command> generate(LessThanNode exp) {
        List<Command> lefts = generate(exp.getLeft());
        List<Command> rights = generate(exp.getRight());
        CCmplt lt = new CCmplt();
        return generate(lt, lefts, rights);
    }

    private List<Command> generate(LessThanEqualsNode exp) {
        List<Command> lefts = generate(exp.getLeft());
        List<Command> rights = generate(exp.getRight());
        CCmple lt = new CCmple();
        return generate(lt, lefts, rights);
    }

    private List<Command> generate(MoreThanNode exp) {
        List<Command> lefts = generate(exp.getLeft());
        List<Command> rights = generate(exp.getRight());
        CCmpgt gt = new CCmpgt();
        return generate(gt, lefts, rights);
    }

    private List<Command> generate(MoreThanEqualsNode exp) {
        List<Command> lefts = generate(exp.getLeft());
        List<Command> rights = generate(exp.getRight());
        CCmpge ge = new CCmpge();
        return generate(ge, lefts, rights);
    }

    private List<Command> generate(AssignNode exp) {
        List<Command> cs = new ArrayList<>();
        if (exp.getTarget() instanceof DotNode) {
            //we are trying to set a field of an object
            //example: a.b = 2
            DotNode dotNode = (DotNode) exp.getTarget();
            List<Command> objRef = generate(dotNode.getLeft());
            List<Command> fieldValue = generate(exp.getValue());
            CPutField putField = new CPutField(dotNode.getRight().name);
            cs.addAll(objRef);
            cs.addAll(fieldValue);
            cs.add(putField);
            return cs;
        } else if (exp.getTarget() instanceof IdentifierNode) {
            //assigning a value to an identifier
            //example: a = 2
            IdentifierNode id = (IdentifierNode) exp.getTarget();
            List<Command> value = generate(exp.getValue());
            CStore store = new CStore(id.name);
            cs.addAll(value);
            cs.add(store);
            return cs;
        }
        throw new RuntimeException("unsupported target type");
    }

    private List<Command> generate(CallNode callNode) {
        List<Command> cs = new ArrayList<>();
        if (callNode.getThisArg() == null) {
            //function call
            //example: a()
            /*
                push a CParamBoundary onto the stack (#-1)
                resolve parameters and push the resolved values on to the stack
                CInvokeFunc #0
                vm sees #0 and creates a new call stack (#1).
                vm sets the new call stack's return address (#-2) properly
                vm sets the caller's local variable space (#2) as the parent scope of #1's local variable space (#3).
                vm starts to transfer (not copy, but transfer) all parameters to the new stack until it sees a CParamBoundary
                vm pops out CParamBoundary, it is not needed anymore.
                vm gets the function name from #0
                vm finds the function meta info in #2, including start index
                vm jumps to start index position and execute commands from there.
                vm continues executing util it sees a return command (#4)
                vm resolves the return value (if there is any) in #4 and copy it back to #-1
                vm set the execution pointer back to the return address #-2 recorded in #1
                vm pops #1 out from the function call stack.
                vm continue executing commands from #-2
             */
            cs.add(new CParamBoundary());
            cs.addAll(resolveAndPushArguments(callNode));
            cs.add(new CInvokeFunc(callNode.getFuncName().name));
            return cs;
        } else {
            //method call
            //example: a.b()
            /*
                for now all methods are methods of built in objects
                so we can take a shortcut here
                push thisArg onto the stack
                push a CParamBoundary onto the stack
                resolve parameters and push the resolved values on to the stack
                CInvokeMethod
                vm sees CInvokeMethod command, reads thisArg and all parameters
                vm reads the method name from CInvokeMethod command
                vm resolves thisArg and calls its method, using the parameters read
                vm pushes the return value (if there is any) onto the stack
             */
            cs.addAll(generate(callNode.getThisArg()));
            cs.add(new CParamBoundary());
            cs.addAll(resolveAndPushArguments(callNode));
            cs.add(new CInvokeMethod(callNode.getFuncName().name));
            return cs;
        }
    }

    private List<Command> generate(DotNode dotNode) {
        List<Command> cs = new ArrayList<>();
        cs.addAll(generate(dotNode.getLeft()));
        cs.add(new CReadField(dotNode.getRight().name));
        return cs;
    }

    private List<Command> generate(IdentifierNode idn){
        return Collections.singletonList(new CLoad(idn.name));
    }

    private List<Command> generateEndSurveyCommand() {
        return Collections.singletonList(new CEnd());
    }

    private List<Command> generate(SendDataNode sdn) {
        //vm pops all questions references until it sees a CParamBoundary (and also pops the CParamBoundary)
        //vm sends all the question datas to UI
        //vm waits on the answer input
        //vm merges the answer input to the data in the heap.
        List<Command> cs = new ArrayList<>();
        cs.add(new CParamBoundary());
        cs.addAll(sdn.getData().stream().map(this::generate).flatMap(List::stream).collect(Collectors.toList()));
        cs.add(new CSendQuestion());
        return cs;
    }

    private List<Command> generateAwaitCommand() {
        return Collections.singletonList(new CAwait());
    }

    private List<Command> resolveAndPushArguments(CallNode callNode) {
        return callNode.getArguments()
                .stream()
                .map(this::generate)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    private int getLineNumber(TokenAssociation ta) {
        return ta.getToken() == null ? NO_LINE_NUMBER : ta.getToken().getLine();
    }

    private void setLineNumberForCommands(List<Command> commands, int lineNumber) {
        commands.forEach(c -> c.setLineNumber(lineNumber));
    }

}
