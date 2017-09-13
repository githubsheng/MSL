rm *.tokens
rm -rf generated
mkdir generated

java org.antlr.v4.Tool DLSLexer.g4 -o generated
java org.antlr.v4.Tool DLSParser.g4 -o generated

cp generated/*.tokens .

javac ./generated/*.java

//classpath is set in system environments in control panel
java org.antlr.v4.gui.TestRig DLS file -gui test.txt