package DLS.CommandGenerator.commands.stack;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the string we want to stack onto the stack.
 */
public class CString extends AbstractCommand {

    public CString(String str) {
        this.setFirstOperand(str);
    }

    @Override
    public String getName() {
        return "string";
    }
}
