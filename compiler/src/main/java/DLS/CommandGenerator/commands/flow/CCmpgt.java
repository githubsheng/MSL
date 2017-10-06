package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;
import DLS.CommandGenerator.commands.flow.CompareAndBranch;

public class CCmpgt extends AbstractCommand implements CompareAndBranch, SetBranchIndex {

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

    @Override
    public void setBranchIndex() {
        if(!branchIfGreaterThan.isIndexSet()) throw new IllegalStateException("index of `branchIfGreaterThan` is not certain at this stage");
        setFirstOperand(branchIfGreaterThan.getIndex());
    }
}
