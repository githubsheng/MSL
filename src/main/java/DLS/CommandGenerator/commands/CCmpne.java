package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CCmpne extends AbstractCommand {

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
}
