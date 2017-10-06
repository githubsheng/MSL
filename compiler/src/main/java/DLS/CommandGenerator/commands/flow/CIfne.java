package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CIfne extends AbstractCommand implements SetBranchIndex {

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

    @Override
    public void setBranchIndex() {
        if(!branchIfNotEqualsZero.isIndexSet()) throw new IllegalStateException("index of `branchIfNotEqualsZero` is not certain at this stage");
        setFirstOperand(branchIfNotEqualsZero.getIndex());
    }
}
