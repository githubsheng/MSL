package DLS.ASTNodes.enums.methods;

public enum ListMethods {
    RANDOMIZE("randomize"), ROTATE("rotate");

    private String name;
    ListMethods(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}