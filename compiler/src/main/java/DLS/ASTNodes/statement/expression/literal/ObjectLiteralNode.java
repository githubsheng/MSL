package DLS.ASTNodes.statement.expression.literal;

import DLS.ASTNodes.statement.expression.ExpressionNode;

import java.util.List;
import java.util.Optional;

public class ObjectLiteralNode extends ExpressionNode {

    private final List<Field> fields;

    public ObjectLiteralNode(List<Field> fields) {
        this.fields = fields;
    }

    public List<Field> getFields() {
        return fields;
    }

    public Optional<Field> getFieldByName(String name){
        return fields.stream().filter(f -> f.getName().equals(name)).findAny();
    }

    public void addField(Field field) {
        this.fields.add(field);
    }

    public static class Field {
        private final String name;
        private final ExpressionNode value;

        public Field(String name, ExpressionNode value) {
            this.name = name;
            this.value = value;
        }

        public String getName() {
            return name;
        }

        public ExpressionNode getValue() {
            return value;
        }
    }
}
