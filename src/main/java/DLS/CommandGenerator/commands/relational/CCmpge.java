package DLS.CommandGenerator.commands.relational;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;
import DLS.CommandGenerator.commands.flow.CompareAndBranch;

public class CCmpge extends AbstractCommand implements CompareAndBranch {

    private Command branchIfGreaterThanEquals;

    @Override
    public String getName() {
        return "cmp_ge";
    }

    public Command getBranchIfGreaterThanEquals() {
        return branchIfGreaterThanEquals;
    }

    public void setBranchIfGreaterThanEquals(Command branchIfGreaterThanEquals) {
        this.branchIfGreaterThanEquals = branchIfGreaterThanEquals;
    }

    @Override
    public void setBranch(Command command) {
        setBranchIfGreaterThanEquals(command);
    }
}
