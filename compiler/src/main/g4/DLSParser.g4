parser grammar DLSParser;

options { tokenVocab=DLSLexer; }

file: pluginImport* element* | Temp statement*;

pluginImport
: ImportJS ImportUrl
| ImportCSS ImportUrl
;

element
: page
| pageGroup
;

//todo: allow script to be inside page group
pageGroup
: PageGroupStart attributes Close script page+ PageGroupEnd
;

page
: (PageStart|ScriptPageStart) attributes Close script question+ SubmitButton script PageEnd
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
| expression (Equals | NotEquals) expression                                        #EqualityExpression
| expression And expression                                                         #LogicalAndExpression
| expression Or expression                                                          #LogicalOrExpression
| expression Assign expression                                                      #AssignmentExpression
| Clock                                                                             #ClockExpression
| Identifier                                                                        #IdentifierExpression
| literal                                                                           #LiteralExpression
| rowLiteral                                                                        #RowLiteralExpression
| colLiteral                                                                        #ColumnLiteralExpression
| LeftParen expression RightParen                                                   #ParenthesizedExpression
;

//todo: should be able to do something like this: 1m50s 4h50s or something
literal
: DecimalLiteral            #DecimalLiteral
| BooleanLiteral            #BooleanLiteral
| StringLiteral             #StringLiteral
| Hours Minutes? Seconds?   #HoursLiteral
| Minutes Seconds?          #MinutesLiteral
| Seconds                   #SecondsLiteral
| ClockUnit                 #ClockUnitLiteral
;

rowLiteral: ScriptModeRowStart attributes Close scriptTextArea ScriptModeInLineTagClose;

colLiteral: ScriptModeColStart attributes Close scriptTextArea ScriptModeInLineTagClose;

scriptTextArea: (ScriptTextArea | ('${' expression '}'))+;

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

//we do not support filter and map for now
listOperationStatement
: Each Identifier NewLine statements End
;

chanceStatement: Chance NewLine possibility+ End;

possibility: Percentage Colon NewLine? statements;

builtInCommandStatement
: Terminate                                     #TerminateCommand
| Select expression                             #SelectCommand
| Rank rankOrders                               #RankCommand
| Print expression                              #PrintCommand
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
| singleMatrixQuestion
| multipleMatrixQuestion
;

singleChoiceQuestion
: SingleChoiceStart attributes Close textArea rows+=row+
;

multipleChoiceQuestion
: MultipleChoiceStart attributes Close textArea rows+=row+
;

singleMatrixQuestion
: SingleChoiceMatrixStart attributes Close textArea rows+=row+ cols+=col+
;

multipleMatrixQuestion
: MultipleChoiceMatrixStart attributes Close textArea rows+=row+ cols+=col+
;

row
: RowStart attributes Close textArea
;

col
: ColStart attributes Close textArea
;

textArea: (TextArea | ('${' expression '}'))+;