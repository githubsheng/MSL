package DLS.ASTNodes;

/**
 * Created by wangsheng on 10/9/17.
 */
public class AssignmentNode extends Node {

    public String target;
    public Node value;

    public AssignmentNode(String target, Node value) {
        this.target = target;
        this.value = value;
    }

    @Override
    public String toString() {
        return "AssignmentNode{" +
                "target='" + target + '\'' +
                ", value=" + value +
                '}';
    }
}
