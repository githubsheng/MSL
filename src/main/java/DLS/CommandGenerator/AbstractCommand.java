package DLS.CommandGenerator;

/**
 * Created by wangsheng on 30/9/17.
 */
public abstract class AbstractCommand implements Command {

    static final int NO_LINE_NUMBER = -1;

    @Override
    public int getLineNumber() {
        return NO_LINE_NUMBER;
    }

    @Override
    public String getFirstOperand() {
        return null;
    }

    @Override
    public String getSecondOperand() {
        return null;
    }

    @Override
    public String getThirdOperand() {
        return null;
    }
}
