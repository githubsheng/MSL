lexer grammar DLSLexer;

@members {
    private int opened = 0;
}

Temp:
'###temp'
-> pushMode(ScriptMode)
;

ImportJS: 'JS';
ImportCSS: 'CSS';

ImportUrl: String;

PageGroupStart
: '[PageGroup'
-> pushMode(ScriptMode), pushMode(TagMode)
;

PageGroupEnd: '[PageGroupEnd]';

PageStart
: '[Page'
-> pushMode(ScriptMode), pushMode(TagMode)
;


WS
: [ \t\n\r]+
-> skip
;

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
RowsStart: '[Rows';
ColsStart: '[Cols';

mode TextAreaMode;

TextArea: .*? TextAreaEnd {
     int offSet = 0;
     String matched = getText();
     if(matched.endsWith("[Row")) {
        offSet = 4;
        pushMode(TagMode);
     } else if (matched.endsWith("[Col")) {
        offSet = 4;
        pushMode(TagMode);
     } else if (matched.endsWith("[Rows")) {
        offSet = 5;
        pushMode(TagMode);
     } else if (matched.endsWith("[Cols")) {
        offSet = 5;
        pushMode(TagMode);
     } else if(matched.endsWith("[Submit")) {
        offSet = 7;
        popMode();
        pushMode(ScriptMode);
     } else if(matched.endsWith("[SingleChoice")) {
        offSet = 13;
        popMode();
        pushMode(ScriptMode);
     } else if(matched.endsWith("[MultipleChoice")) {
        offSet = 15;
        popMode();
        pushMode(ScriptMode);
     } else if(matched.endsWith("[SingleMatrix")) {
        offSet = 13;
        popMode();
        pushMode(ScriptMode);
     } else if(matched.endsWith("[MultipleMatrix")) {
        offSet = 15;
        popMode();
        pushMode(ScriptMode);
     } else if(matched.endsWith("[Empty")) {
        offSet = 6;
        popMode();
        pushMode(ScriptMode);
     } else if(matched.endsWith("${")) {
        offSet = 2;
        pushMode(ScriptMode);
     }
     int idx = _input.index();
     _input.seek(idx - offSet);
};

TextAreaEnd
: RowStart
| ColStart
| RowsStart
| ColsStart
| '[Submit'
| '${'
| SingleChoiceStart
| MultipleChoiceStart
| SingleChoiceMatrixStart
| MultipleChoiceMatrixStart
| EmptyQuestionStart
;

mode ScriptMode;

SubmitButton: '[Submit]';

ScriptModeWS
: [ \t]+
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
Else: 'else';
End: 'end';
Def: 'def';
Global: 'global';

//array related
Each: 'each';
//we will support map and filter later.
//Map: 'map';
//Filter: 'filter';

//chance related
Chance: 'chance';
Colon: ':';
Percentage: DecimalIntegerLiteral '%';

//function related
Func: 'function';
Return: 'return';

//punctutations
LeftParen: '(' {opened++;};
RightParen: ')' {opened--;};
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

ScriptModeInLineTagClose: '[End]';

NewLine
: [\n\r]+
{
    if(opened > 0) skip();
}
;

//built in commands
Terminate: 'terminate';
Select: 'select';
Deselect: 'deselect';
Rank: 'rank';
Print: 'print';

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
RankOrder: '->';

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
Seconds: DecimalIntegerLiteral 's';
Minutes: DecimalIntegerLiteral 'm';
Hours: DecimalIntegerLiteral 'h';

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

Clock: 'clock';

//identifier
Identifier
: Name
| '$' Name   //this is for $element and $index inside an list loop.
;

TextInjectionStart: '${';

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
: '[SingleMatrix'
-> popMode, pushMode(TextAreaMode), pushMode(TagMode)
;

MultipleChoiceMatrixStart
: '[MultipleMatrix'
-> popMode, pushMode(TextAreaMode), pushMode(TagMode)
;

EmptyQuestionStart
: '[Empty'
-> popMode, pushMode(TextAreaMode), pushMode(TagMode)
;



//if a page is inside a page group, it would appear after the page group script..
//it is different than PageStart in that it does not need to push a ScriptMode because
//PageGroupStart already does that.
ScriptPageStart
: '[Page'
-> pushMode(TagMode)
;

PageEnd
: '[PageEnd]'
-> popMode
;

mode ScriptTextAreaMode;

ScriptTextArea: ~[\r\n]+? ScriptTextAreaEnd {
     int offSet = 0;
     String matched = getText();

     if(matched.endsWith("[End]")) {
        offSet = 5;
        popMode();
     }

     if(matched.endsWith("${")) {
        offSet = 2;
        pushMode(ScriptMode);
     }

     int idx = _input.index();
     _input.seek(idx - offSet);
};

ScriptTextAreaEnd
: '[End]'
| '${'
;