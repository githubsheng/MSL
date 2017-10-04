package DLS.CommandGenerator.commands;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the name of the field being set.
 */
public class CPutField extends AbstractCommand {

    public CPutField(String fieldName){
        this.setFirstOperand(fieldName);
    }

    @Override
    public String getName() {
        return "put_field";
    }
}
