lexer grammar TestLexer;

Placehoder: 'PlaceHolder';

OutterMostRule
: SomethingElse InnerRule;

SomethingElse: 'SomethingElse';
InnerRule: 'Inner' -> pushMode(MyMode); //if this command is executed, Special in MyMode will match
Normal: 'Sheng';

mode MyMode;
Special: 'Sheng';





