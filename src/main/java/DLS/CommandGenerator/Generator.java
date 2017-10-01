package DLS.CommandGenerator;

import DLS.ASTNodes.TokenAssociation;
import DLS.ASTNodes.statement.*;
import DLS.ASTNodes.statement.expression.ExpressionNode;
import DLS.CommandGenerator.commands.CDefFunc;
import DLS.CommandGenerator.commands.CNull;
import DLS.CommandGenerator.commands.CStore;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static DLS.CommandGenerator.Command.NO_LINE_NUMBER;

/**
 * Created by wangsheng on 30/9/17.
 */
public class Generator {

    private List<Command> commands = new ArrayList<>();

    public List<Command> generate(List<StatementNode> statements) {
        return commands;
    }

    private void generate(StatementNode statement) {
        if(statement instanceof DefNode) {
            generate((DefNode)statement);
        } else if (statement instanceof ExpressionStatementNode) {
            generate((ExpressionStatementNode)statement);
        } else if (statement instanceof FuncDefNode) {
            generate((FuncDefNode)statement);
        } else if (statement instanceof IfElseNode) {
            generate((IfElseNode)statement);
        } else if (statement instanceof ListOptNode) {
            generate((ListOptNode)statement);
        } else if (statement instanceof ReturnNode) {
            generate((ReturnNode)statement);
        }
        //todo: end survey node
        //todo: send data node
        //todo: receive data blocking node
        throw new RuntimeException("unsupported statement type");
    }

    private void generate(DefNode defNode) {
        int lineNumber = getLineNumber(defNode);
        if(defNode.getInitializer().isPresent()) {
            generate(defNode.getInitializer().get(), lineNumber);
        } else {
            CNull pushNull = new CNull();
            pushNull.setLineNumber(NO_LINE_NUMBER);
            commands.add(new CNull());
        }
        CStore store = new CStore();
        store.setFirstOperand(defNode.getIdentifier().name);
        store.setLineNumber(lineNumber);
        commands.add(store);
    }

    private void generate(ExpressionStatementNode esn) {

    }

    private void generate(FuncDefNode fd) {
        CDefFunc c = new CDefFunc();
        commands.add(c);
        c.setFirstOperand(fd.getName().name);
        /*
            next command is the command that initialize our first parameter, and that is really
            the begin of the execution of the function.
         */
        c.setSecondOperand(getStartIndexOfNextCommand());
        c.setThirdOperand(String.valueOf(fd.getArgumentList().size()));
        c.setLineNumber(getLineNumber(fd));
        //vm will create a new call stack
        //vm should record the caller's return index
        //vm will transfer all parameters from caller's stack to the new call stack
        //during transfer vm should check whether the number of parameters is correct
        fd.getArgumentList().stream().map(argName -> {
            CStore s = new CStore();
            s.setFirstOperand(argName);
            return s;
        }).forEach(s -> commands.add(s));
        generate(fd.getStatements());
    }

    private void generate(IfElseNode ien) {
    }

    private void generate(ListOptNode lon) {

    }

    private void generate(ReturnNode ret) {

    }

    /**
     * generate commands for a expression
     * @param exp expression node
     * @param lineNumber add line number to generated commands, if lineNumber is not -1.
     */
    private void generate(ExpressionNode exp, int lineNumber) {
        //todo:
    }

    private int getLineNumber(TokenAssociation ta) {
        return ta.getToken() == null ? NO_LINE_NUMBER : ta.getToken().getLine();
    }

    private String getStartIndexOfNextCommand() {
        return String.valueOf(commands.size());
    }

}
