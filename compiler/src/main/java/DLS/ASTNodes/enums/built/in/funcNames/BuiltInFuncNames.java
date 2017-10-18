package DLS.ASTNodes.enums.built.in.funcNames;

/**
 * Created by wangsheng on 24/9/17.
 */
public enum BuiltInFuncNames {

    /*
        this function takes two parameters. a lower bound (inclusive ) and a higher bound (exclusive)
        it returns a random integer between the lower bound and higher bound
     */
    GetRandomNumber("_getRandomNumber"),
    /*
        This method creates a list object.
        see ListMethods for more information about the methods of list object
        list object has following properties:
        1. size
     */
    List("List"),
    PRINT("_print"),
    CLOCK("_clock");

    private final String funcName;

    BuiltInFuncNames(String funcName) {
        this.funcName = funcName;
    }

    public String getFuncName(){
        return this.funcName;
    }

}
