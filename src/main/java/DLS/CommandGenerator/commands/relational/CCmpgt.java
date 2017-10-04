package DLS.CommandGenerator.commands.relational;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;
import DLS.CommandGenerator.commands.flow.CompareAndBranch;

public class CCmpgt extends AbstractCommand implements CompareAndBranch {

    private Command branchIfGreaterThan;

    @Override
    public String getName() {
        return "cmp_gt";
    }

    public Command getBranchIfGreaterThan() {
        return branchIfGreaterThan;
    }

    public void setBranchIfGreaterThan(Command branchIfGreaterThan) {
        this.branchIfGreaterThan = branchIfGreaterThan;
    }

    @Override
    public void setBranch(Command command) {
        setBranchIfGreaterThan(command);
    }
}
