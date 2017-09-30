package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand: the variable name
 */
public class CStore extends AbstractCommand {
    @Override
    public String getName() {
        return "store";
    }
}
