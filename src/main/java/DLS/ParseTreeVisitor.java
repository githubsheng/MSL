package DLS;

import DLS.ASTNodes.FileNode;
import DLS.ASTNodes.Node;
import DLS.ASTNodes.function.declaration.FuncDefNode;
import DLS.generated.DLSParser;
import DLS.generated.DLSParserBaseVisitor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by wangsheng on 10/9/17.
 */

//todo: this is just a test.
public class ParseTreeVisitor extends DLSParserBaseVisitor<Node> {

    @Override
    public Node visitFile(DLSParser.FileContext ctx) {
        //we sees pages as functions ( has its own local variable scope )
        //we sees a page group as a function that contains functions (pages)
        List<FuncDefNode> funcNodeList = ctx.element().stream().map(e -> {
            Node node = e.page() != null ? visitPage(e.page()) : visitPageGroup(e.pageGroup());
            return (FuncDefNode)node;
        }).collect(Collectors.toList());

        return new FileNode(funcNodeList);
    }

    @Override
    public Node visitPageGroup(DLSParser.PageGroupContext ctx) {
        //todo:
        return super.visitPageGroup(ctx);
    }

    @Override
    public Node visitPage(DLSParser.PageContext ctx) {
        //todo:
        return super.visitPage(ctx);
    }
}
