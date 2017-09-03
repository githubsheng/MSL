// Generated from DLSParser.g4 by ANTLR 4.7
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link DLSParser}.
 */
public interface DLSParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link DLSParser#file}.
	 * @param ctx the parse tree
	 */
	void enterFile(DLSParser.FileContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLSParser#file}.
	 * @param ctx the parse tree
	 */
	void exitFile(DLSParser.FileContext ctx);
}