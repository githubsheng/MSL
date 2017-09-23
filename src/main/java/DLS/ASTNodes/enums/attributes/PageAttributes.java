package DLS.ASTNodes.enums.attributes;

public enum PageAttributes {

    ID("id"), HIDE("hide"), RANDOMIZE("randomize"), ROTATE("rotate");

    private String name;
    PageAttributes(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}