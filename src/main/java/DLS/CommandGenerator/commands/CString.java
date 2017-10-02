package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the string we want to push onto the stack.
 */
public class CString extends AbstractCommand {

    CString(String str) {
        this.setFirstOperand(str);
    }

    @Override
    public String getName() {
        return "string";
    }
}
