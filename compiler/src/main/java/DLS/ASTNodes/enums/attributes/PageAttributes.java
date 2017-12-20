package DLS.ASTNodes.enums.attributes;

public enum PageAttributes {

    ID("id"), HIDE("hide"), SHOW("show"), RANDOMIZE("randomize"), ROTATE("rotate");

    private final String name;
    private final String attribIdentifierName;

    private PageAttributes(String attribNameInTag){
        this.name = attribNameInTag;
        this.attribIdentifierName = "_" + attribNameInTag;
    }

    public String toIdentifierName(){
        return this.attribIdentifierName;
    }

    public String getName() {
        return this.name;
    }

}