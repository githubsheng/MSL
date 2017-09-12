package DLS.ASTNodes;

import DLS.ASTNodes.function.declaration.FuncDefNode;

import java.util.List;

/**
 * Created by wangsheng on 12/9/17.
 */
public class FileNode extends Node {

    //page is interpreted as functions
    //lets not worry about page group first...

    public final List<FuncDefNode> pagesAsFunctions;

    public FileNode(List<FuncDefNode> pagesAsFunctions) {
        this.pagesAsFunctions = pagesAsFunctions;
    }

}
