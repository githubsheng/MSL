package DLS.CommandGenerator.commands.function;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;
import DLS.CommandGenerator.commands.flow.SetBranchIndex;

/**
 * first operand: function name
 * second operand: start index
 * third operand: number of arguments
 */
public class CDefFunc extends AbstractCommand implements SetBranchIndex {

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

    @Override
    public void setBranchIndex() {
        if(!executionStart.isIndexSet()) throw new IllegalStateException("index of `executionStart` is not certain at this stage");
        setSecondOperand(executionStart.getIndex());
    }
}
