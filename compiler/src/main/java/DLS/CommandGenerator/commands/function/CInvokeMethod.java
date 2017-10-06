package DLS.CommandGenerator.commands.function;

import DLS.CommandGenerator.AbstractCommand;

/**
 * first operand is the method name
 */
public class CInvokeMethod extends AbstractCommand {

    public CInvokeMethod(String methodName){
        setFirstOperand(methodName);
    }

    @Override
    public String getName() {
        return "invoke_method";
    }
}
