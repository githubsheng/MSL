lexer grammar TestLexer;

A: 'pushTwoMode' -> pushMode(SomeMode), pushMode(NestedMode);
W: 'world';

mode SomeMode;
X: 'hello';
//W is not defined in this mode and won't work unless we explicitly reference it in a rule defined
//inside this mode, like W1: W
//And no, you cannot re-define W in this mode like W: W;
//You cannot simply put W here like W; and expect it to just work.
//Only solution: define a new rule inside this mode and in this rule, use W, then W will (only) work
//inside this new rule in this mode. Examples are W1: W; W1: W | OtherRule | AnotherRule;
W1: W;
C: 'popSecondMode' -> popMode;

mode NestedMode;
Y: 'hello';
W2: W;
B: 'popOneMode' -> popMode;






