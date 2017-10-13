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
        this function should create a list and the list should have the following methods:
        get(index): get an element at index.
        set(index, element): add an element at the specified index position, shifting following elements to the end
        remove(index): remove an element at the specified index position, shifting all following element to the beginning
        empty(): empty the list
        addFirst(element): add an element at the beginning of the list.
        addLast(element): add an element at the end of the list.
        removeFirst(): removes the element at the beginning of the list
        removeLast(): removes the element at the end of the list
        has(element): checks whether the list contains a certain element
        indexOf(element): returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.
        addAllFirst(list): add all the elements of a list to the head of the current list
        addAllLast(list): add all the elements of a list to the end of the current list
        add(element): same as addLast

        the list should also have the following public properties:
        size: the size of the list
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
