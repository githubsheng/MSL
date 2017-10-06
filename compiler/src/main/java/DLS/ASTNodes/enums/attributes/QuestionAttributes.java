package DLS.ASTNodes.enums.attributes;

public enum QuestionAttributes {

    ID("id"), HIDE("hide"), RANDOMIZE("randomize"), ROTATE("rotate"), REQUIRED("true");

    private String name;
    QuestionAttributes(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}