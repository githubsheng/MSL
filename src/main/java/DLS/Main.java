package DLS;

import DLS.ASTNodes.Node;
import DLS.generated.DLSLexer;
import DLS.generated.DLSParser;
import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * Created by wangsheng on 10/9/17.
 */
public class Main {

    public static void main(String[] args) throws IOException {

        //todo: change this url from hardcoded to something else
        ClassLoader classLoader = Main.class.getClassLoader();
        File file = new File(classLoader.getResource("input.txt").getFile());

        // create a CharStream that reads from standard input
        ANTLRInputStream input = new ANTLRInputStream(new FileInputStream(file));

        // create a lexer that feeds off of input CharStream
        DLSLexer lexer = new DLSLexer(input);

        // create a buffer of tokens pulled from the lexer
        CommonTokenStream tokens = new CommonTokenStream(lexer);

        // create a parser that feeds off the tokens buffer
        DLSParser parser = new DLSParser(tokens);


        ParseTree tree = parser.file(); // begin parsing at init rule

        ParseTreeVisitor ptv = new ParseTreeVisitor();
        Node node = ptv.visit(tree);
        System.out.println(1);


    }
}
