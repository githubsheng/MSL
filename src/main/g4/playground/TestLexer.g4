lexer grammar TestLexer;

TextArea: .+? Ends {
     System.out.println("match!!!");
     String matched = getText();
     int offSet = 0;
     if(matched.endsWith("Row")) offSet = 4;
     if(matched.endsWith("Column")) offSet = 7;
     pushMode(TagMode);
     int idx = _input.index();
     _input.seek(idx - offSet);
};

Ends
: '[Row'
| '[Column'
;

mode TagMode;
RowStart: '[Row';
ColStart: '[Column';
WS: [ ]+ -> skip;
Name: [a-zA-Z]+;
Close: ']' -> popMode;







