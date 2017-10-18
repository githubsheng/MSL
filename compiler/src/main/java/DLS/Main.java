package DLS;

import DLS.ASTNodes.Node;
import DLS.ASTNodes.statement.StatementNode;
import DLS.CommandGenerator.Generator;
import DLS.CommandGenerator.Result;
import DLS.generated.DLSLexer;
import DLS.generated.DLSParser;
import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;

import java.io.*;
import java.util.List;

public class Main {

    public static void main(String[] args) throws IOException {

        //todo: change this url from hardcoded to something else
        ClassLoader classLoader = Main.class.getClassLoader();
        String sourcePath = null;
        String outputPath = null;
        if (args.length > 0) sourcePath = args[0];
        if (args.length > 1) outputPath = args[1];
        File file;
        if (sourcePath != null) {
            file = new File(sourcePath);
        } else {
            file = new File(classLoader.getResource("input.txt").getFile());
        }
        // create a CharStream that reads from standard input
        ANTLRInputStream input = new ANTLRInputStream(new FileInputStream(file));

        // create a lexer that feeds off of input CharStream
        DLSLexer lexer = new DLSLexer(input);

        // create a buffer of tokens pulled from the lexer
        CommonTokenStream tokens = new CommonTokenStream(lexer);

        // create a parser that feeds off the tokens buffer
        DLSParser parser = new DLSParser(tokens);

        DLSParser.FileContext fileContext = parser.file(); // begin parsing at init rule

        ParseTreeVisitor ptv = new ParseTreeVisitor();
        List<StatementNode> statements = ptv.visitFile(fileContext);
        Generator cmdGen = new Generator();
        Result ret = cmdGen.getCommands(statements);

        String commandsStrFileName;
        String stringConstantsFileName;
        if (outputPath == null) {
            commandsStrFileName = "commandsStr.txt";
            stringConstantsFileName = "stringConstants.txt";
        } else {
            commandsStrFileName = outputPath + "/commandsStr.txt";
            stringConstantsFileName = outputPath + "/stringConstants.txt";
        }

        try (FileWriter fw = new FileWriter(commandsStrFileName, false);
             BufferedWriter bw = new BufferedWriter(fw);
             PrintWriter out = new PrintWriter(bw)) {
            for (String cmdStr : ret.commands) out.println(cmdStr);
        } catch (IOException e) {
            //exception handling left as an exercise for the reader
        }

        try (FileWriter fw = new FileWriter(stringConstantsFileName, false);
             BufferedWriter bw = new BufferedWriter(fw);
             PrintWriter out = new PrintWriter(bw)) {
            for (String strConst : ret.stringConstants) out.println(strConst);
        } catch (IOException e) {
            //exception handling left as an exercise for the reader
        }

        if (args.length == 0) {
            try (FileWriter fw = new FileWriter("../interpreter/test/main.html", false);
                 BufferedWriter bw = new BufferedWriter(fw);
                 PrintWriter out = new PrintWriter(bw)) {
                out.println("<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <title>Title</title>\n" +
                        "    <link rel=\"stylesheet\" href=\"styles.css\"/>\n" +
                        "    <script src=\"../dist/test-bundle.js\"></script>\n" +
                        "</head>\n" +
                        "<body onload=\"init()\">\n" +
                        "<fieldset>\n" +
                        "    <legend>Commands:</legend>\n" +
                        "    <textarea id=\"commands\">");
                for (String cmdStr : ret.commands) out.println(cmdStr);
                out.println("    </textarea>\n" +
                        "</fieldset>\n" +
                        "<fieldset>\n" +
                        "    <legend>String constants:</legend>\n" +
                        "    <textarea id=\"string-constants\">");
                for (String strConst : ret.stringConstants) out.println(strConst);
                out.println("    </textarea>\n" +
                        "</fieldset>\n" +
                        "<div class=\"clear\"></div>\n" +
                        "<input id=\"add-break-points\" placeholder=\"add break points\"/>\n" +
                        "<button onclick=\"addBreakPoints()\">Add break points</button>\n" +
                        "<input id=\"remove-break-points\" placeholder=\"delete break points\"/>\n" +
                        "<button onclick=\"deleteBreakPoints()\">Delete break points</button>\n" +
                        "<br/><br/>\n" +
                        "<button onclick=\"run()\">Run</button>\n" +
                        "<button onclick=\"debug()\">Debug/Resume</button>\n" +
                        "<button onclick=\"restartDebug()\">Restart debug</button>\n" +
                        "<button onclick=\"stepOver()\">Step over</button>\n" +
                        "<div id=\"break-points\"></div>");
            } catch (IOException e) {
                //exception handling left as an exercise for the reader
            }
        }

        System.out.println("successful");
    }
}
