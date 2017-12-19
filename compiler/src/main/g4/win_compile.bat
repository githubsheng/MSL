rem please run this in git bash...otherwise rm won't be recognized.
rm *.tokens
rm -rf ../java/DLS/generated

rem even in git bash, when we use mkdir ../java/DLS/generated it will complain. we need to use \ rather than /
mkdir ..\java\DLS\generated

java org.antlr.v4.Tool DLSLexer.g4 -o ../java/DLS/generated -package DLS.generated DLSLexer.g4
java org.antlr.v4.Tool DLSParser.g4 -o ../java/DLS/generated -package DLS.generated -visitor DLSParser.g4

cp ../java/DLS/generated/*.tokens .

javac ../java/DLS/generated/*.java

rem classpath is set in system environments in control panel
java org.antlr.v4.gui.TestRig DLS.generated.DLS file -gui input.txt
rem java org.antlr.v4.gui.TestRig DLS.generated.DLSLexer tokens -tokens input.txt