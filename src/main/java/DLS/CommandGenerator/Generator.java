package DLS.CommandGenerator;

import DLS.ASTNodes.statement.*;
import DLS.CommandGenerator.commands.CDefFunc;
import DLS.CommandGenerator.commands.CStore;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    }

    private void generate(ExpressionStatementNode esn) {

    }

    private void generate(FuncDefNode fd) {
        CDefFunc c = new CDefFunc();
        c.setFirstOperand(fd.getName().name);
        /*
            commands.size() will be the index of CDefFunc, its start index is the index
            of the fist store parameter command
         */
        c.setSecondOperand(String.valueOf(commands.size() + 1));
        c.setThirdOperand(String.valueOf(fd.getArgumentList().size()));
        if(fd.getToken()!=null)c.setLineNumber(fd.getToken().getLine());
        this.commands.add(c);
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

}
