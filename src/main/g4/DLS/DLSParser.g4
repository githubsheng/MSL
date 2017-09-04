parser grammar DLSParser;

options { tokenVocab=DLSLexer; }

file
: page*
| pageGroup*
;

pageGroup
: PageGroupStart attributes Close page+ PageGroupEnd
;

page
: PageStart attributes Close script question+ SubmitButton script PageEnd
;

attributes
: attribute*
;

attribute
: Name
| Name AttributeAssign String
;

script: ( statement | functionDeclaration )*;

eos: NewLine; //end of statement

//todo: more kinds of statements
statement
: variableStatement
| emptyStatement
| expressionStatement
//todo: if statement
//todo: iteration / map /filter statement
//todo: return statement
//todo: chance statement
;

variableStatement: Def Identifier initialiser? eos;

initialiser: Assign expression;

expressionStatement: expression eos;

//todo: review this and add other expressions if need it, for instance, List literal.
//todo: Notice that some expression in JS grammars are actually statements.
expression
: expression Dot Identifier
| Not expression
| expression ( Multiply | Divide | Modulus ) expression
| expression ( Plus | Minus ) expression
| expression ( LessThan | MoreThan | LessThanEquals | MoreThanEquals ) expression
| expression And expression
| expression Or expression
| Identifier
| literal
;

literal
: DecimalLiteral
| BooleanLiteral
| StringLiteral
;

emptyStatement: eos+;

//todo: add parameter list.
functionDeclaration: Func Identifier LeftBracket RightBracket eos functionBody End;

//in our script you cannot declare a function inside another function. This removes the need for user
//to understand closure.
functionBody: statement*;

question
: singleChoiceQuestion
| multipleChoiceQuestion
;

singleChoiceQuestion
: SingleChoiceStart attributes Close TextArea rows
;

multipleChoiceQuestion
: MultipleChoiceStart attributes Close TextArea rows
;

rows
: row+
;

row
: RowStart attributes Close TextArea
;