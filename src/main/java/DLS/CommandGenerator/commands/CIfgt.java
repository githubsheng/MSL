package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CIfgt extends AbstractCommand {

    private Command branchIfNotGreater;

    @Override
    public String getName() {
        return "compare_branch";
    }

    public Command getBranchIfNotGreater() {
        return branchIfNotGreater;
    }

    public void setBranchIfNotGreater(Command branchIfNotGreater) {
        this.branchIfNotGreater = branchIfNotGreater;
    }
}
