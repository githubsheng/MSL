package DLS.ASTNodes.enums.built.in.fields;

public enum AnswerFields {
    IsSelected("selected"), Rank("rank");

    private final String name;

    AnswerFields(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
