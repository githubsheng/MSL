package DLS.ASTNodes;

import org.antlr.v4.runtime.Token;

/**
 * Created by sheng.wang on 2017/09/29.
 */
public interface TokenAssociation {
    Token getToken();
    void setToken(Token token);
}
