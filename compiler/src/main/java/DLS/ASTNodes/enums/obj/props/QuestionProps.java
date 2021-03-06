package DLS.ASTNodes.enums.obj.props;

//all the attributes defined in package DLS.ASTNodes.enums.attributes will also become properties
public enum QuestionProps {
    ID("id"),
    TYPE("type"),
    SINGLE_CHOICE("single-choice"),
    MULTIPLE_CHOICE("multiple-choice"),
    SINGLE_MATRIX("single-matrix"),
    MULTIPLE_MATRIX("multiple-matrix"),
    EmptyQuestion("empty-question"),
    ROWS("rows"),
    COLS("cols"),
    TEXT("text");
    private String name;
    QuestionProps(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}
