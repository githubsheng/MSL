package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CCmpeq extends AbstractCommand {

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
}
