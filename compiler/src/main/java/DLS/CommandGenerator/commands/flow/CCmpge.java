package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;
import DLS.CommandGenerator.commands.flow.CompareAndBranch;

public class CCmpge extends AbstractCommand implements CompareAndBranch, SetBranchIndex {

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

    @Override
    public void setBranch(Command command) {
        setBranchIfGreaterThanEquals(command);
    }

    @Override
    public void setBranchIndex() {
        if(!branchIfGreaterThanEquals.isIndexSet()) throw new IllegalStateException("index of branchIfGreaterThanEquals is not certain at this stage");
        setFirstOperand(branchIfGreaterThanEquals.getIndex());
    }
}
