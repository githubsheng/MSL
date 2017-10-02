package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CCmpge extends AbstractCommand {

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
}
