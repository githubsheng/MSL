package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand: function name
 * second operand: start index
 * third operand: number of arguments
 */
public class CDefFunc extends AbstractCommand {

    @Override
    public String getName() {
        return "def_func";
    }

}
