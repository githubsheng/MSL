package DLS.CommandGenerator.commands.stack;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the name of the variable you want to load onto the stack.
 */
public class CLoad extends AbstractCommand {

    public CLoad(String variableName) {
        this.setFirstOperand(variableName);
    }

    @Override
    public String getName() {
        return "load";
    }
}
