package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;
import DLS.CommandGenerator.commands.flow.CompareAndBranch;

public class CCmple extends AbstractCommand implements CompareAndBranch, SetBranchIndex {

    private Command branchIfLessThanEquals;

    @Override
    public String getName() {
        return "cmp_le";
    }

    public Command getBranchIfLessThanEquals() {
        return branchIfLessThanEquals;
    }

    public void setBranchIfLessThanEquals(Command branchIfLessThanEquals) {
        this.branchIfLessThanEquals = branchIfLessThanEquals;
    }

    @Override
    public void setBranch(Command command) {
        setBranchIfLessThanEquals(command);
    }

    @Override
    public void setBranchIndex() {
        if(!branchIfLessThanEquals.isIndexSet()) throw new IllegalStateException("index of `branchIfLessThanEquals` is not certain at this stage");
        setFirstOperand(branchIfLessThanEquals.getIndex());
    }
}
