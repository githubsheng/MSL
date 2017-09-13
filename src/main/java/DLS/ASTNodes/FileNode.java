package DLS.ASTNodes;

import DLS.ASTNodes.function.declaration.FuncDefNode;

import java.util.List;

/**
 * Created by wangsheng on 12/9/17.
 */
public class FileNode extends Node {

    public final List<Node> nodes;

    /**
     *
     * @param nodes A list of nodes. A node can only be PageNode or a PageGroupNode
     */
    public FileNode(List<Node> nodes) {
        //todo: validation of the node type here.
        this.nodes = nodes;
    }

}
