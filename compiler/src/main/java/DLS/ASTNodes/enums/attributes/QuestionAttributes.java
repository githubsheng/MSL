package DLS.ASTNodes.enums.attributes;

public enum QuestionAttributes {

    ID("id"),
    HIDE("hide"),
    RANDOMIZE("randomize"),
    ROTATE("rotate"),
    RANDOMIZE_COL("randomize_col"),
    ROTATE_COL("rotate_col"),
    REQUIRED("required");

    private String name;
    QuestionAttributes(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}