package DLS.ASTNodes.enums.methods;

public enum ListMethods {
    RANDOMIZE("randomize"),
    ROTATE("rotate"),
    //get(i)
    GET("get"),
    //has(element)
    HAS("has"),
    //indexOf(element)
    INDEX_OF("indexOf"),
    //same as addLast
    ADD("add"),
    //addFirst(element)
    ADD_FIRST("addFirst"),
    //addLast(element)
    ADD_LAST("addLast"),
    //addAllFirst(list)
    ADD_ALL_FIRST("addAllFirst"),
    //addAllLast("addAllLast")
    ADD_ALL_LAST("addAllLast"),
    //set(index, element)
    SET("set"),
    //addAt(index, element)
    ADD_AT("addAt"),
    //removeFirst()
    REMOVE_FIRST("removeFirst"),
    //removeLast()
    REMOVE_LAST("removeLast"),
    //remove(element)
    REMOVE("remove"),
    //removeAt(index)
    REMOVE_AT("removeAt"),
    //clear()
    CLEAR("clear");

    private String name;
    ListMethods(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}