package DLS.CommandGenerator;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.*;
import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.CommandGenerator.commands.CDefFunc;
import DLS.CommandGenerator.commands.CNull;
import DLS.CommandGenerator.commands.CStore;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static DLS.CommandGenerator.Command.NO_LINE_NUMBER;

/**
 * Created by wangsheng on 30/9/17.
 */
public class Generator {

    public List<Command> generate(List<StatementNode> statements) {
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
        }
        //todo: end survey node
        //todo: send data node
        //todo: receive data blocking node
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
        CStore store = new CStore();
        store.setFirstOperand(defNode.getIdentifier().name);
        commands.add(store);
        /*
            set line number to all related commands. when we stop at an variable definition, we do not want
            any part of the definition to run, including initialization expression.
         */
        commands.forEach(c -> c.setLineNumber(lineNumber));
        return commands;
    }

    private List<Command> generate(ExpressionStatementNode esn) {
        return null;
    }

    private List<Command> generate(FuncDefNode fd) {
        List<Command> commands = new LinkedList<>();
        CDefFunc c = new CDefFunc();
        c.setFirstOperand(fd.getName().name);
        //we wait when all commands are ready then we find out all function def nodes and set their start index.
        c.setThirdOperand(String.valueOf(fd.getArgumentList().size()));
        c.setLineNumber(getLineNumber(fd));
        commands.add(c);
        //vm will create a new call stack
        //vm should record the caller's return index
        //vm will transfer all parameters from caller's stack to the new call stack
        //during transfer vm should check whether the number of parameters is correct
        List<Command> executions = fd.getArgumentList().stream().map(argName -> {
            CStore s = new CStore();
            s.setFirstOperand(argName);
            return s;
        }).collect(Collectors.toList());
        executions.addAll(generate(fd.getStatements()));
        //executions size is at least one because we always generate a return command
        c.setExecutionStart(executions.get(0));
        return commands;
    }

    private List<Command> generate(IfElseNode ien) {
        return null;
    }

    private List<Command> generate(ListOptNode lon) {
        return null;
    }

    private List<Command> generate(ReturnNode ret) {
        return null;
    }

    /**
     * generate commands for a expression
     * @param exp expression node
     */
    private List<Command> generate(ExpressionNode exp) {
        //todo:
        return Collections.emptyList();
    }

    private int getLineNumber(TokenAssociation ta) {
        return ta.getToken() == null ? NO_LINE_NUMBER : ta.getToken().getLine();
    }

}
