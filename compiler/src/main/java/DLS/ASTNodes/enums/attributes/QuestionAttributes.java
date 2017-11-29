package DLS.ASTNodes.enums.attributes;

public enum QuestionAttributes {

    ID("id"),
    HIDE("hide"),
    RANDOMIZE("randomize"),
    ROTATE("rotate"),
    RANDOMIZE_COL("randomizeCol"),
    ROTATE_COL("rotateCol"),
    REQUIRED("required");

    private String name;
    QuestionAttributes(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}