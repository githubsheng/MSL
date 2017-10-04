package DLS.CommandGenerator;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.*;
import DLS.ASTNodes.statement.built.in.commands.EndSurveyNode;
import DLS.ASTNodes.statement.built.in.commands.ReceiveDataBlockingNode;
import DLS.ASTNodes.statement.built.in.commands.SendDataNode;
import DLS.ASTNodes.statement.expression.ExpressionNode;
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
import DLS.CommandGenerator.commands.*;
import DLS.CommandGenerator.commands.flow.*;
import DLS.CommandGenerator.commands.math.*;
import DLS.CommandGenerator.commands.relational.CCmpge;
import DLS.CommandGenerator.commands.relational.CCmpgt;
import DLS.CommandGenerator.commands.relational.CCmple;
import DLS.CommandGenerator.commands.relational.CCmplt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static DLS.CommandGenerator.Command.NO_LINE_NUMBER;

public class Generator {

    private final static String LOOP_INDEX = "$index";
    private final static String LOOP_ELEMENT = "$element";

    public List<Command> getCommands(List<StatementNode> statements) {
        List<Command> cs = statements.stream()
                .map(this::generate)
                .flatMap(List::stream)
                .collect(Collectors.toList());
        //todo: set index for all commands
        //todo: set start index for function definitions
        //todo: set branch index for all branch commands
        //todo: set go to index for all goto commands.
        return cs;
    }

    private List<Command> generate(List<StatementNode> statements) {
        return statements.stream().map(this::generate)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    private List<Command> generate(StatementNode statement) {
        if(statement instanceof DefNode) {
            return generate((DefNode)statement);
        } else if (statement instanceof ExpressionStatementNode) {
            return generate((ExpressionStatementNode)statement);
        } else if (statement instanceof FuncDefNode) {
            return generate((FuncDefNode)statement);
        } else if (statement instanceof IfElseNode) {
            return generate((IfElseNode)statement);
        } else if (statement instanceof ListOptNode) {
            return generate((ListOptNode)statement);
        } else if (statement instanceof ReturnNode) {
            return generate((ReturnNode)statement);
        } else if (statement instanceof EndSurveyNode) {
            //todo:
            return Collections.emptyList();
        } else if (statement instanceof SendDataNode) {
            //todo:
            return Collections.emptyList();
        } else if (statement instanceof ReceiveDataBlockingNode) {
            //todo:
            return Collections.emptyList();
        }
        throw new RuntimeException("unsupported statement type");
    }

    private List<Command> generate(DefNode defNode) {
        List<Command> commands = new LinkedList<>();
        int lineNumber = getLineNumber(defNode);
        if(defNode.getInitializer().isPresent()) {
            commands.addAll(generate(defNode.getInitializer().get()));
        } else {
            commands.add(new CNull());
        }
        CStore store = new CStore(defNode.getIdentifier().name);
        commands.add(store);
        /*
            set line number to all related commands. when we stop at an variable definition, we do not want
            any part of the definition to run, including initialization expression.
         */
        setLineNumberForCommands(commands, lineNumber);
        return commands;
    }

    private List<Command> generate(ExpressionStatementNode esn) {
        return null;
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
        for(IfElseNode.Branch branch : ien.getBranches()) {
            List<Command> branchConditionCommands = generate(branch.getCondition());
            List<Command> branchStatementCommands = generate(branch.getStatements());
            CIfeq cmp = new CIfeq();
            if(prevCmp != null)prevCmp.setBranchIfEqualsZero(branchConditionCommands.get(0));
            prevCmp = cmp;
            CGoTo cGoTo = new CGoTo();
            cGoTo.setGoToCommand(last);
            commands.addAll(branchConditionCommands);
            commands.add(cmp);
            commands.addAll(branchStatementCommands);
            commands.add(cGoTo);
        }
        if(prevCmp == null) throw new RuntimeException("maybe if else statement is missing a branch?");
        if(prevCmp.getBranchIfEqualsZero() == null) prevCmp.setBranchIfEqualsZero(last);
        commands.add(last);
        return commands;
    }

    private List<Command> generate(ListOptNode lon) {
        List<Command> commands = new ArrayList<>();
        /*
            example:
            some commands generated from statements before the loop
            newScope
            push 0
            store $index
            load $index                     #3
            load arr_ref
            readField length
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
        commands.add(new CReadField("length"));
        CCmpge cmpge = new CCmpge();
        commands.add(cmpge);
        commands.add(new CInc(LOOP_INDEX));
        commands.add(new CLoad(lon.getListName().name));
        commands.add(new CLoad(LOOP_INDEX));
        commands.add(new CALoad());
        commands.add(new CStore(LOOP_ELEMENT));

        commands.addAll(generate(lon.getStatements()));

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
        if(ret.getReturnValue().isPresent()) {
            commands.addAll(generate(ret.getReturnValue().get()));
            commands.add(new CReturnVal());
        } else {
            commands.add(new CReturnNull());
        }
        return commands;
    }

    /**
     * generate commands for a expression
     * @param exp expression node
     */
    private List<Command> generate(ExpressionNode exp) {
        if(exp instanceof AddNode) {
            //math category
            return generate((AddNode)exp);
        } else if (exp instanceof DivideNode) {
            return generate((DivideNode)exp);
        } else if (exp instanceof MinusNode) {
            return generate((MinusNode)exp);
        } else if (exp instanceof ModulusNode) {
            return generate((ModulusNode)exp);
        } else if (exp instanceof MultiplyNode) {
            return generate((MultiplyNode)exp);
        } else if (exp instanceof AndNode) {
            //flow category
            return generate((AndNode)exp);
        } else if (exp instanceof EqualsNode) {
            return generate((EqualsNode)exp);
        } else if (exp instanceof NotEqualsNode) {
            return generate((NotEqualsNode)exp);
        } else if (exp instanceof NotNode) {
            return generate((NotNode)exp);
        } else if (exp instanceof OrNode) {
            return generate((OrNode)exp);
        } else if (exp instanceof BooleanNode) {
            //literal category
            return generate((BooleanNode)exp);
        } else if (exp instanceof NumberNode) {
            return generate((NumberNode)exp);
        } else if (exp instanceof ObjectLiteralNode) {
            return generate((ObjectLiteralNode)exp);
        } else if (exp instanceof StringNode) {
            return generate((StringNode)exp);
        } else if (exp instanceof LessThanEqualsNode) {
            //relational category
            return generate((LessThanEqualsNode)exp);
        } else if (exp instanceof LessThanNode) {
            return generate((LessThanNode)exp);
        } else if (exp instanceof MoreThanEqualsNode) {
            return generate((MoreThanEqualsNode)exp);
        } else if (exp instanceof MoreThanNode) {
            return generate((MoreThanNode)exp);
        }
        //todo: other categories
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
        return Collections.singletonList(new CString(strNode.getVal()));
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

    private int getLineNumber(TokenAssociation ta) {
        return ta.getToken() == null ? NO_LINE_NUMBER : ta.getToken().getLine();
    }

    private void setLineNumberForCommands(List<Command> commands, int lineNumber) {
        commands.forEach(c -> c.setLineNumber(lineNumber));
    }

}
