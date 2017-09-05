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
| ifStatement
//todo: iteration / map /filter statement
| returnStatement
//todo: chance statement
;

variableStatement: Def Identifier initialiser? eos;

initialiser: Assign expression;

emptyStatement: eos+;

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
| expression Assign expression
| Identifier
| literal
| listLiteral
| rowLiteral
| colLiteral
| LeftParen expression RightParen
;

literal
: DecimalLiteral
| BooleanLiteral
| StringLiteral
;

listLiteral: List LeftParen listElements RightParen;

listElements: expression (Comma expression)*;

rowLiteral: LeftParen LeftBracket Row attributes RightBracket StringLiteral RightParen;

colLiteral: LeftParen LeftBracket Col attributes RightBracket StringLiteral RightParen;

ifStatement: If NewLine? expression NewLine? Then NewLine thenBody End eos;

thenBody: statement*;

returnStatement
: Return eos
| Return expression eos
;


//todo: add parameter list.
functionDeclaration: Func Identifier LeftParen RightParen eos functionBody End;

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