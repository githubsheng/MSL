package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the number we want to push on to the stack.
 */
public class CNumber extends AbstractCommand {

    public CNumber(boolean isTrue) {
        this((isTrue ? 1 : 0));
    }

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
