package DLS.CommandGenerator;

/**
 * Created by wangsheng on 30/9/17.
 */
public interface Command {

    final int NO_LINE_NUMBER = -1;

    String getName();
    int getLineNumber();
    String getFirstOperand();
    String getSecondOperand();
    String getThirdOperand();
    void setLineNumber(int lineNumber);
    void setFirstOperand(String str);
    void setSecondOperand(String str);
    void setThirdOperand(String str);
    String print();
}
