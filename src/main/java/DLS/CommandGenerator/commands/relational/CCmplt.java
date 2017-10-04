package DLS.CommandGenerator.commands.relational;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;
import DLS.CommandGenerator.commands.flow.CompareAndBranch;

public class CCmplt extends AbstractCommand implements CompareAndBranch {

    private Command branchIfLessThan;

    @Override
    public String getName() {
        return "cmp_lt";
    }

    public Command getBranchIfLessThan() {
        return branchIfLessThan;
    }

    public void setBranchIfLessThan(Command branchIfLessThan) {
        this.branchIfLessThan = branchIfLessThan;
    }

    @Override
    public void setBranch(Command command) {
        setBranchIfLessThan(command);
    }
}
