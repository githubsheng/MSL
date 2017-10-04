package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CCmpeq extends AbstractCommand implements CompareAndBranch {

    private Command branchIfEquals;

    @Override
    public String getName() {
        return "cmp_eq";
    }

    public Command getBranchIfEquals() {
        return branchIfEquals;
    }

    public void setBranchIfEquals(Command branchIfEquals) {
        this.branchIfEquals = branchIfEquals;
    }

    @Override
    public void setBranch(Command command) {
        setBranchIfEquals(command);
    }
}
