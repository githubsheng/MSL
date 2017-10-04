package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CIfeq extends AbstractCommand {

    private Command branchIfEqualsZero;

    @Override
    public String getName() {
        return "if_eq_0";
    }

    public Command getBranchIfEqualsZero() {
        return branchIfEqualsZero;
    }

    public void setBranchIfEqualsZero(Command branchIfNotGreater) {
        this.branchIfEqualsZero = branchIfNotGreater;
    }

}
