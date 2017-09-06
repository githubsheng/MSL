lexer grammar DLSLexer;

WS
: [ \t\n\r]+
-> skip
;

PageGroupStart
: '[PageGroup'
-> pushMode(TagMode)
;

PageStart
: '[Page'
-> pushMode(ScriptMode), pushMode(TagMode)
;

PageGroupEnd: '[PageGroupEnd]';

mode TagMode;

TagModeWS
: WS
-> skip;

Name: NameStartChar NameChar*;
fragment NameStartChar: [a-zA-Z];
fragment NameChar: [a-zA-Z0-9];

String: '"'DoubleStringCharacter*'"';

BindingOpen
: '{'
-> pushMode(ScriptMode)
;

AttributeAssign: '=';

/*
Our code will eventually mac_compile to JS code.
Some JS engine allow the following pattern to be used to write a single string
in multiple lines.
"hello \
world"
In the above example, a bash slash and a return ends the first line. This is equivalent
to the following
"hello "
+ "world"
We do not match this kind of case because string is mostly used a property value in DLS.
If we need to write a really long string, we can use the second way (using +).
*/
fragment DoubleStringCharacter
: ~["\\\r\n]
| '\\' EscapeSequence
;

/*
no octal escape is allowed in strict mode, so we don't try to match \1234
\0 is a special escape (not octal) that means "null". It is difficult to
distinguish \0 from octal here and since \0 is used very infrequently, we
do not try to match \0 either.
*/
fragment EscapeSequence
: CharacterEscapeSequence
| HexEscapeSequence
| UnicodeEscapeSequence
;

fragment CharacterEscapeSequence
: SingleEscapeCharacter
| NonEscapeCharacter
;

fragment SingleEscapeCharacter
: ['"\\bfnrtv]
;

//no 0-9 so we don't match octal escape like \123
fragment NonEscapeCharacter
: ~['"\\bfnrtv0-9xu\r\n]
;

fragment HexEscapeSequence
: 'x' HexDigit HexDigit
;

fragment UnicodeEscapeSequence
: 'u' HexDigit HexDigit HexDigit HexDigit
;

fragment HexDigit
: [0-9a-fA-F]
;

Close
: ']' -> popMode
;

RowStart: '[Row';
ColStart: '[Col';

mode TextAreaMode;

TextArea: .+? TextAreaEnd {
     int offSet = 0;
     String matched = getText();
     if(matched.endsWith("[Row")) {
        offSet = 4;
        pushMode(TagMode);
     }
     if(matched.endsWith("[Column")) {
        offSet = 7;
        pushMode(TagMode);
     }
     if(matched.endsWith("[Submit")) {
        offSet = 7;
        popMode();
        pushMode(ScriptMode);
     }
     if(matched.endsWith("[SingleChoice")) {
        offSet = 13;
        popMode();
        pushMode(ScriptMode);
     }
     int idx = _input.index();
     _input.seek(idx - offSet);
};

TextAreaEnd
: '[Row'
| '[Column'
| '[Submit'
| SingleChoiceStart
;

mode ScriptMode;

SubmitButton: '[Submit]';

ScriptModeWS
: [ \t]
-> skip
;
/*
Some keywords
If new line does not serve statement termination (like ; in Java),
then we should skip them in the lexer phase. The best way here to skip
them is to merge them into the preceding token.
*/
If: 'if';
Then: 'then';
//todo: add else
//todo: add if else
End: 'end';
Def: 'def';
//todo: add global

//array related
List: 'list';
Each: 'each';
Map: 'map';
Filter: 'filter';

//chance related
Chance: 'chance';
Colon: ':';
Percentage: DecimalIntegerLiteral '%';

//function related
Func: 'function';
Return: 'return';

//punctutations
LeftParen: '(';
RightParen: ')';
LeftBracket: '[';
RightBracket: ']';
Comma: ',';
Dot: '.';

//option related
ScriptModeRowStart
: '[Row'
-> pushMode(ScriptTextAreaMode), pushMode(TagMode)
;

ScriptModeColStart
: '[Col'
-> pushMode(ScriptTextAreaMode), pushMode(TagMode)
;

ScriptModeInLineTagClose: '[end]';

NewLine
: '\r\n'+
| '\n'+
;

//built in commands
GoTo: 'goTo';
Terminate: 'terminate';
Select: 'select';
Rank: 'rank';

//operators
Assign: '=';
Not: '!';
Plus: '+';
Minus: '-';
Multiply: '*';
Divide: '/';
Modulus: '%';
LessThan: '<';
MoreThan: '>';
LessThanEquals: '<=';
MoreThanEquals: '>=';
Equals: '==';
NotEquals: '!=';
And: 'and';
Or: 'or';

//numbers
fragment DecimalDigit
: [0-9]
;

fragment DecimalIntegerLiteral
: '0'
| [1-9] DecimalDigit*
;

DecimalLiteral
: DecimalIntegerLiteral '.' DecimalDigit*   //example: 12.38
| DecimalIntegerLiteral                     //example: 12
;

//time related
Time: 'time';
Seconds: DecimalIntegerLiteral 's';
Minutes: DecimalIntegerLiteral 'm';
Hours: DecimalIntegerLiteral 'h';

Clock: 'clock';
ClockUnit
: '12am'        //00:00
| [1-9] 'am'    //01:00 ~ 09:00
| '10am'        //10:00
| '11am'        //11:00
| '12pm'        //12:00
| [1-9]'pm'     //13:00 ~ 21:00
| '10pm'        //22:00
| '11pm'        //23:00
;

//booleans
BooleanLiteral
: 'true'
| 'false'
;

StringLiteral: String;

//identifier
Identifier: Name;

BindingClose
: '}'
-> popMode
;

SingleChoiceStart
: '[SingleChoice'
-> popMode, pushMode(TextAreaMode), pushMode(TagMode)
;

MultipleChoiceStart
: '[MultipleChoice'
-> popMode, pushMode(TextAreaMode), pushMode(TagMode)
;

SingleChoiceMatrixStart
: '[SingleChoiceMatrix'
-> popMode, pushMode(TextAreaMode), pushMode(TagMode)
;

PageEnd
: '[PageEnd]'
-> popMode
;

mode ScriptTextAreaMode;

ScriptTextAreaLastChar
: ~[\r\n]
{_input.LA(1) == '[' && _input.LA(2) == 'e' && _input.LA(3) == 'n' && _input.LA(4) == 'd' && _input.LA(5) == ']'}?
-> popMode;

ScriptTextAreaChar: ~[\r\n];



