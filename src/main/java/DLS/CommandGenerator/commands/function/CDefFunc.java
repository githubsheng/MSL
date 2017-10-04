package DLS.CommandGenerator.commands.function;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

/**
 * first operand: function name
 * second operand: start index
 * third operand: number of arguments
 */
public class CDefFunc extends AbstractCommand {

    private Command executionStart;

    @Override
    public String getName() {
        return "def_func";
    }

    public Command getExecutionStart() {
        return executionStart;
    }

    public void setExecutionStart(Command executionStart) {
        this.executionStart = executionStart;
    }
}
