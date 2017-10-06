package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

/**
 * first operand is the index of `branchIfEquals` command
 */
public class CCmpeq extends AbstractCommand implements CompareAndBranch, SetBranchIndex {

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

    @Override
    public void setBranch(Command command) {
        setBranchIfEquals(command);
    }

    @Override
    public void setBranchIndex() {
        if(!branchIfEquals.isIndexSet()) throw new IllegalStateException("index of `branchIfEquals` is not certain at this stage");
        setFirstOperand(branchIfEquals.getIndex());
    }
}
