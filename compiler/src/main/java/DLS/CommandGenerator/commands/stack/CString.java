package DLS.CommandGenerator.commands.stack;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the string we want to stack onto the stack.
 */
public class CString extends AbstractCommand {

    public CString(int strIndex) {
        this.setFirstOperand(strIndex);
    }

    @Override
    public String getName() {
        return "string";
    }
}
