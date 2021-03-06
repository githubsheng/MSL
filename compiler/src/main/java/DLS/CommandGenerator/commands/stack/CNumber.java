package DLS.CommandGenerator.commands.stack;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the number we want to stack on to the stack.
 */
public class CNumber extends AbstractCommand {

    public CNumber(int i) {
        this.setFirstOperand(String.valueOf(i));
    }

    public CNumber(double d) {
        this.setFirstOperand(String.valueOf(d));
    }

    @Override
    public String getName() {
        return "number";
    }
}
