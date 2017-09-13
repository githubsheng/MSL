package DLS.ASTNodes.statement.expression.literal;

/**
 * Created by sheng.wang on 2017/09/13.
 */
public class BooleanNode {

    private final boolean isTrue;

    public BooleanNode(boolean isTrue) {
        this.isTrue = isTrue;
    }

    public boolean isTrue() {
        return isTrue;
    }
}
