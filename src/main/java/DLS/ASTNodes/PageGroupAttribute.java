package DLS;

//todo: come up with all attributes
public enum PageGroupAttribute {
    RANDOMIZE("randomize"), ROTATE("rotate");

    private final String attribIdentifierName;

    private PageGroupAttribute(String attribNameInTag){
        this.attribIdentifierName = "_" + attribNameInTag;
    }

    @Override
    public String toString() {
        return attribIdentifierName;
    }
}
