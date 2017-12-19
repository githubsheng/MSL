package DLS.ASTNodes.enums.obj.props;

//all the attributes defined in package DLS.ASTNodes.enums.attributes will also become properties
public enum OptionProps {
    TEXT("text"), TYPE("type"), ID("id");
    private String name;
    OptionProps(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}
