package DLS.ASTNodes.enums.built.in.funcNames;

/**
 * Created by wangsheng on 24/9/17.
 */
public enum BuiltInFuncNames {

    GetRandomNumber("_getRandomNumber"), List("List");

    private final String funcName;

    BuiltInFuncNames(String funcName) {
        this.funcName = funcName;
    }

    public String getFuncName(){
        return this.funcName;
    }

}
