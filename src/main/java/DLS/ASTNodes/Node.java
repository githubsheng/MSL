package DLS.ASTNodes;

import org.antlr.v4.runtime.Token;

abstract public class Node {

    private final Token token;

    public Node(Token token) {
        this.token = token;
    }
}
