package DLS.CommandGenerator.commands.stack;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is true or false
 */
public class CBoolean extends AbstractCommand {

    public CBoolean(boolean isTrue) {
        this.setFirstOperand(String.valueOf(isTrue));
    }

    @Override
    public String getName() {
        return "bool";
    }
}
