package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the name of the variable we are going to increment
 */
public class CInc extends AbstractCommand {

    public CInc(String variableName) {
        this.setFirstOperand(variableName);
    }

    @Override
    public String getName() {
        return "inc";
    }
}
