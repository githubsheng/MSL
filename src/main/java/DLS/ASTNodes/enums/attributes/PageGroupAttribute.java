package DLS.ASTNodes.enums.attributes;

//todo: come up with all attributes
public enum PageGroupAttribute {
    RANDOMIZE("randomize"), ROTATE("rotate");

    private final String name;
    private final String attribIdentifierName;

    private PageGroupAttribute(String attribNameInTag){
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
