package DLS.ASTNodes;

/**
 * Created by wangsheng on 10/9/17.
 */
public class AdditiveNode extends Node {

    public String left;
    public String right;

    public AdditiveNode(String left, String right) {
        this.left = left;
        this.right = right;
    }

    @Override
    public String toString() {
        return "AdditiveNode{" +
                "left='" + left + '\'' +
                ", right='" + right + '\'' +
                '}';
    }
}
