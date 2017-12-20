package DLS;

import DLS.ASTNodes.Node;
import DLS.ASTNodes.statement.StatementNode;
import DLS.CommandGenerator.Generator;
import DLS.CommandGenerator.Result;
import DLS.generated.DLSLexer;
import DLS.generated.DLSParser;
import DLS.validation.PropertyValidator;
import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTreeWalker;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class Main {

    //todo: the main methods needs to get a flag to find out whether we are evaluating a console expression or a survey..
    public static void main(String[] args) throws IOException {

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

        //check whether properties are correct..
        ParseTreeWalker walker = new ParseTreeWalker();
        PropertyValidator propertyValidator = new PropertyValidator();
        walker.walk(propertyValidator, fileContext);

        //generate abstract syntax tree...
        ParseTreeVisitor ptv = new ParseTreeVisitor();
        //todo: here, if we are evaluating a console expression, then maybe we use ptv.visitConsoleInput
        List<StatementNode> statements = ptv.visitFile(fileContext);

        //generate commands...
        int commandIndexOffset = 0;
        int stringConstantsIndexOffset = 0;
        Generator cmdGen;
        if (args.length > 3) {
            commandIndexOffset = Integer.valueOf(args[2]);
            stringConstantsIndexOffset = Integer.valueOf(args[3]);
            cmdGen = new Generator(commandIndexOffset, stringConstantsIndexOffset);
        } else {
            cmdGen = new Generator();
        }

        Result ret = cmdGen.getCommands(statements);

        String commandsStrFileName;
        String stringConstantsFileName;
        String pluginImportsFileName;
        if (outputPath == null) {
            commandsStrFileName = "commandsStr.txt";
            stringConstantsFileName = "stringConstants.txt";
            pluginImportsFileName = "pluginImports.txt";
        } else {
            commandsStrFileName = outputPath + "/commandsStr.txt";
            stringConstantsFileName = outputPath + "/stringConstants.txt";
            pluginImportsFileName = outputPath + "/pluginImports.txt";
        }

        PrintWriter out = null;
        try {
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(commandsStrFileName, false), StandardCharsets.UTF_8));
            out = new PrintWriter(bw);
            for (String cmdStr : ret.commands) out.println(cmdStr);
        } catch (IOException e) {
            System.out.println(e);
        } finally {
            if(out != null) {
                out.close();
            }
        }

        try {
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(stringConstantsFileName, false), StandardCharsets.UTF_8));
            out = new PrintWriter(bw);
            for (String strConst : ret.stringConstants) out.println(strConst);
        } catch (IOException e) {
            System.out.println(e);
        } finally {
            if(out != null) {
                out.close();
            }
        }

        try {
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(pluginImportsFileName, false), StandardCharsets.UTF_8));
            out = new PrintWriter(bw);
            for (String pi : ret.pluginImports) out.println(pi);
        } catch (IOException e) {
            System.out.println(e);
        } finally {
            if(out != null) {
                out.close();
            }
        }

        System.out.println("successful");
    }
}
