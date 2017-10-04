package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CCmpne extends AbstractCommand implements CompareAndBranch {

    private Command branchIfNotEquals;

    @Override
    public String getName() {
        return "cmp_ne";
    }

    public Command getBranchIfNotEquals() {
        return branchIfNotEquals;
    }

    public void setBranchIfNotEquals(Command branchIfNotEquals) {
        this.branchIfNotEquals = branchIfNotEquals;
    }

    @Override
    public void setBranch(Command command) {
        setBranchIfNotEquals(command);
    }
}
