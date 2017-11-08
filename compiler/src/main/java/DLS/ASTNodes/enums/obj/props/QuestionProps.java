package DLS.ASTNodes.enums.obj.props;

public enum QuestionProps {
    TYPE("type"),
    SINGLE_CHOICE("single-choice"),
    MULTIPLE_CHOICE("multiple-choice"),
    SINGLE_MATRIX("single-matrix"),
    MULTIPLE_MATRIX("multiple-matrix");
    private String name;
    QuestionProps(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}
