package DLS.ASTNodes.enums.attributes;

public enum RowAttributes {

    ID("id"), HIDE("hide"), FIXED("fixed"), XOR("xor"), TEXTBOX("textbox"), USE("use");

    private String name;
    RowAttributes(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}