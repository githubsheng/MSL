package DLS.CommandGenerator.commands.function;

import DLS.CommandGenerator.AbstractCommand;

/**
 * the first operand is the name of the function.
 */
public class CInvokeFunc extends AbstractCommand {

    public CInvokeFunc(String funcName){
        setFirstOperand(funcName);
    }

    @Override
    public String getName() {
        return "invoke_func";
    }
}
