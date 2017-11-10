package DLS.validation;

import DLS.ASTNodes.enums.attributes.*;
import DLS.ASTNodes.enums.obj.props.OptionProps;
import DLS.ASTNodes.enums.obj.props.QuestionProps;
import DLS.Util.Util;
import DLS.generated.DLSParser;
import DLS.generated.DLSParserBaseListener;

import java.util.HashSet;
import java.util.Set;

public class PropertyValidator extends DLSParserBaseListener {

    private final Set<String> builtInPropNames = new HashSet<>();
    private final Util util = new Util();

    public PropertyValidator() {
        for (ColAttributes attrName : ColAttributes.values())
            builtInPropNames.add(attrName.getName());
        for (PageAttributes attrName : PageAttributes.values())
            builtInPropNames.add(attrName.getName());
        for (PageGroupAttribute attrName : PageGroupAttribute.values())
            builtInPropNames.add(attrName.getName());
        for (QuestionAttributes attrName : QuestionAttributes.values())
            builtInPropNames.add(attrName.getName());
        for (RowAttributes attrName : RowAttributes.values())
            builtInPropNames.add(attrName.getName());
        for (OptionProps propName : OptionProps.values())
            builtInPropNames.add(propName.getName());
        for (QuestionProps propName : QuestionProps.values())
            builtInPropNames.add(propName.getName());
    }

    //the value of any id cannot be the name of any built in attribute. this function checks this.
    private boolean ifIdConflictsWithBuiltInProperties(String attributeName, String attributeValue) {
        return attributeName.equals("id") && builtInPropNames.contains(util.removeDoubleQuotes(attributeValue));
    }

    @Override
    public void enterAttributeWithDefaultValue(DLSParser.AttributeWithDefaultValueContext ctx) {
        if(ctx.Name().getText().equals("id")) {
            StringBuilder errorMsg = new StringBuilder();
            int lineNumber = ctx.getStart().getLine();
            int colNumber = ctx.getStart().getCharPositionInLine();
            errorMsg.append("line ")
                    .append(lineNumber)
                    .append(":")
                    .append(colNumber)
                    .append(" id must have a explicit value. Example: id=\"q1\"");
            System.err.println(errorMsg.toString());
            throw new RuntimeException("invalid id value");
        }
    }

    @Override
    public void enterAttributeWithAssignedStringValue(DLSParser.AttributeWithAssignedStringValueContext ctx) {
        if(ifIdConflictsWithBuiltInProperties(ctx.Name().getText(), ctx.String().getText())) {
            StringBuilder errorMsg = new StringBuilder();
            int lineNumber = ctx.getStart().getLine();
            int colNumber = ctx.getStart().getCharPositionInLine();
            errorMsg.append("line ")
                    .append(lineNumber)
                    .append(":")
                    .append(colNumber)
                    .append(" id value must not conflicts with any existing built in property names: ");
            this.builtInPropNames.forEach(name -> errorMsg.append(name).append(" "));
            System.err.println(errorMsg.toString());
            throw new RuntimeException("invalid id value.");
        }
    }

    @Override
    public void enterAttributeWithAssignedExpression(DLSParser.AttributeWithAssignedExpressionContext ctx) {
        if(ctx.Name().getText().equals("id")) {
            if(ctx.Name().getText().equals("id")) {
                StringBuilder errorMsg = new StringBuilder();
                int lineNumber = ctx.getStart().getLine();
                int colNumber = ctx.getStart().getCharPositionInLine();
                errorMsg.append("line ")
                        .append(lineNumber)
                        .append(":")
                        .append(colNumber)
                        .append(" id cannot use expression as value. Wrong: id={a}, Right: id=\"a\"");
                System.err.println(errorMsg.toString());
                throw new RuntimeException("invalid id value");
            }
        }
    }
}
