package DLS.CommandGenerator.commands.object;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the name of the field.
 */
public class CReadField extends AbstractCommand {

    public CReadField(String fieldName){
        this.setFirstOperand(fieldName);
    }

    @Override
    public String getName() {
        return "read_field";
    }
}
