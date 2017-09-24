parser grammar DLSParser;

options { tokenVocab=DLSLexer; }

file: element*;

element
: page
| pageGroup
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
: Name                                                          #AttributeWithDefaultValue
| Name AttributeAssign String                                   #AttributeWithAssignedStringValue
| Name AttributeAssign '{' expression '}'                       #AttributeWithAssignedExpression
;

//todo: move the function declaration into statements....
script: statement*;

eos: NewLine; //end of statement

statement
: functionDeclaration
| variableStatement
| emptyStatement
| expressionStatement
| ifStatement
| listOperationStatement
| returnStatement
| chanceStatement
| builtInCommandStatement
;

variableStatement
: Def Identifier initialiser? eos
| Def Global Identifier initialiser? eos
;

initialiser: Assign expression;

emptyStatement: eos+;

expressionStatement: expression eos;

//Notice that some expression in JS grammars are actually statements.
expression
: expression Dot Identifier                                                         #MemberExpression
| expression argumentList                                                           #CallExpression
| Not expression                                                                    #NotExpression
| expression ( Multiply | Divide | Modulus ) expression                             #MultiplicativeExpression
| expression ( Plus | Minus ) expression                                            #AdditiveExpression
| expression ( LessThan | MoreThan | LessThanEquals | MoreThanEquals ) expression   #RelationalExpression
| expression Equals expression                                                      #EqualityExpression
| expression And expression                                                         #LogicalAndExpression
| expression Or expression                                                          #LogicalOrExpression
| expression Assign expression                                                      #AssignmentExpression
| Identifier                                                                        #IdentifierExpression
| literal                                                                           #LiteralExpression
| listLiteral                                                                       #ListLiteralExpression
| rowLiteral                                                                        #RowLiteralExpression
| colLiteral                                                                        #ColumnLiteralExpression
| LeftParen expression RightParen                                                   #ParenthesizedExpression
;

literal
: DecimalLiteral        #DecimalLiteral
| BooleanLiteral        #BooleanLiteral
| StringLiteral         #StringLiteral
;

listLiteral: List LeftParen listElements RightParen;

listElements: expression (Comma expression)*;

rowLiteral: ScriptModeRowStart attributes Close scriptTextArea ScriptModeInLineTagClose;

colLiteral: ScriptModeColStart attributes Close scriptTextArea ScriptModeInLineTagClose;

scriptTextArea: ScriptTextAreaChar* ScriptTextAreaLastChar;

ifStatement: noEndingIfStatement End eos;

noEndingIfStatement: If NewLine? expression NewLine? Then NewLine statements elseStatement?;

statements: statement*;

elseStatement
: Else NewLine statements
| Else noEndingIfStatement
;

returnStatement
: Return eos
| Return expression eos
;

listOperationStatement
: (Each | Map | Filter) Identifier NewLine statements End
;

chanceStatement: Chance NewLine possibility+ End;

possibility: Percentage Colon NewLine? statements;

builtInCommandStatement
: Terminate                                     #TerminateCommand
| Select expression                             #SelectCommand
| Rank rankOrders                               #RankCommand
;

rankOrders: expression (RankOrder expression)+;

functionDeclaration: Func Identifier formalArgumentList NewLine functionBody End;

formalArgumentList
: LeftParen RightParen
| LeftParen Identifier (Comma Identifier)* RightParen
;

argumentList
: LeftParen RightParen
| LeftParen expression (Comma expression)* RightParen
;

//in our script you cannot declare a function inside another function. This removes the need for user
//to understand closure.
functionBody: statement*;

question
: singleChoiceQuestion
| multipleChoiceQuestion
;

singleChoiceQuestion
: SingleChoiceStart attributes Close TextArea rows+=row+
;

multipleChoiceQuestion
: MultipleChoiceStart attributes Close TextArea rows+=row+ cols+=col+
;

row
: RowStart attributes Close TextArea
;

col
: ColStart attributes Close TextArea
;

