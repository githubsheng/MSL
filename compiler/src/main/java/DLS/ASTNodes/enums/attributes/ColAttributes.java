package DLS.ASTNodes.enums.attributes;

public enum ColAttributes {

    ID("id"), HIDE("hide"), FIXED("fixed"), XOR("xor"), TEXTBOX("textbox"), USE("use");

    private String name;
    ColAttributes(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}