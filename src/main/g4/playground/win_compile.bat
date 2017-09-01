rm *.tokens
rm -rf generated

mkdir generated
java org.antlr.v4.Tool TestLexer.g4 -o generated
java org.antlr.v4.Tool TestParser.g4 -o generated

cp generated/*.tokens .

javac ./generated/*.java

rem java -cp ./generated org.antlr.v4.gui.TestRig HTML htmlDocument -tokens reddit.txt