package DLS.CommandGenerator;

public abstract class AbstractCommand implements Command {
    //-1 means this command is not annotated with a line number.
    private int lineNumber = -1;
    private String firstOperand = "";
    private String secondOperand = "";
    private String thirdOperand = "";

    @Override
    public int getLineNumber() {
        return lineNumber;
    }

    @Override
    public String getFirstOperand() {
        return firstOperand;
    }

    @Override
    public String getSecondOperand() {
        return secondOperand;
    }

    @Override
    public String getThirdOperand() {
        return thirdOperand;
    }

    @Override
    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }

    @Override
    public void setFirstOperand(String str) {
        this.firstOperand = str;
    }

    @Override
    public void setSecondOperand(String str) {
        this.secondOperand = str;
    }

    @Override
    public void setThirdOperand(String str) {
        this.thirdOperand = str;
    }

    @Override
    public String print() {
        return lineNumber + ":" + getName() + ":" + firstOperand + ":" + secondOperand + ":" + thirdOperand;
    }
}
