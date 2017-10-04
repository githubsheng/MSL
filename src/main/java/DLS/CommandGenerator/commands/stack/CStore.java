package DLS.CommandGenerator.commands.stack;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand: the variable name
 */
public class CStore extends AbstractCommand {

    public CStore(String variableName) {
        this.setFirstOperand(variableName);
    }

    @Override
    public String getName() {
        return "store";
    }
}
