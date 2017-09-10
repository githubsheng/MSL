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

statement
: variableStatement
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
| Identifier argumentList                                                           #FunctionCallExpression
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
: DecimalLiteral
| BooleanLiteral
| StringLiteral
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
: Each Identifier NewLine statements End        #EachStatement
| Map Identifier NewLine statements End         #MapStatement
| Filter Identifier NewLine statements End      #FilterStatement
;

chanceStatement: Chance NewLine possibility+ End;

possibility: Percentage Colon NewLine? statements;

builtInCommandStatement
: GoTo Identifier                               #GoToCommand
| Terminate                                     #TerminateCommand
| Select expression                             #SelectCommand
| Rank rankOrders                               #RankCommand
;

rankOrders: expression (RankOrder expression)+;

functionDeclaration: Func Identifier argumentList NewLine functionBody End;

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