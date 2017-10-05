package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

/**
 * first operand is the goTo index.
 */
public class CGoTo extends AbstractCommand implements SetBranchIndex {

    private Command goToCommand;

    @Override
    public String getName() {
        return "go_to";
    }

    public Command getGoToCommand() {
        return goToCommand;
    }

    public void setGoToCommand(Command goToCommand) {
        this.goToCommand = goToCommand;
    }

    @Override
    public void setBranchIndex() {
        if(!goToCommand.isIndexSet()) throw new IllegalStateException("index of `goToCommand` is not certain at this stage");
        setFirstOperand(goToCommand.getIndex());
    }
}
