package DLS.CommandGenerator.commands.stack;

import DLS.CommandGenerator.AbstractCommand;

/**
 *  store a variable into global variable space. First operand is the name of the variable.
 */
public class CGstore extends AbstractCommand {

    public CGstore(String variableName) {
        this.setFirstOperand(variableName);
    }

    @Override
    public String getName() {
        return "g_store";
    }
}
