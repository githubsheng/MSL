package DLS.CommandGenerator;

/**
 * Created by wangsheng on 30/9/17.
 */
public interface Command {
    String getName();
    int getLineNumber();
    String getFirstOperand();
    String getSecondOperand();
    String getThirdOperand();
}
