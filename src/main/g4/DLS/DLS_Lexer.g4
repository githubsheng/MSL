lexer grammar DLS_Lexer;

//comment

Open: '[';
Close: ']';
Equals: '=';
PageGroup: 'PageGroup';

//todo: maybe name it as PageOpen.... and then based on the image, set the modes.
//todo: just read the image....
Page: 'Page';
SingleChoice: 'SingleChoice';
MultipleChoice: 'MultipleChoice';
SingleChoiceMatrix: 'SingleChoiceMatrix';
MultipleChoiceMatrix: 'MultipleChoiceMatrix';
Row: 'Row';
Column: 'Col';
Submit: '[Submit]';
End: '[End]';

Name: NameStartChar NameChar*;
fragment NameStartChar: [a-zA-Z];
fragment NameChar: [a-zA-Z0-9];

String: '"'DoubleStringCharacter*'"';

//some js engine allow the following pattern to be used to write a single string
//in multiple lines.
//"hello \
//world"
//In the above example, a bash slash and a return ends the first line. This is equivalent
//to the following
//"hello "
//+ "world"
//We do not match this kind of case because string is mostly used a property value in DLS.
//If we need to write a really long string, we can use the second way (using +).
fragment DoubleStringCharacter
: ~["\\\r\n]
| '\\' EscapeSequence
;

//no octal escape is allowed in strict mode, so we don't try to match \1234
//\0 is a special escape (not octal) that means "null". It is difficult to
//distinguish \0 from octal here and since \0 is used very infrequently, we
//do not try to match \0 either.
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

