package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CIfne extends AbstractCommand {

    private Command branchIfNotEqualsZero;

    @Override
    public String getName() {
        return "if_ne_0";
    }

    public Command getBranchIfNotEqualsZero() {
        return branchIfNotEqualsZero;
    }

    public void setBranchIfNotEqualsZero(Command branchIfNotEqualsZero) {
        this.branchIfNotEqualsZero = branchIfNotEqualsZero;
    }
}
