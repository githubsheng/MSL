// Generated from /Users/wangsheng/Documents/antlr/MSL/src/main/g4/DLS/DLS_Parser.g4 by ANTLR 4.7
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link DLS_Parser}.
 */
public interface DLS_ParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#file}.
	 * @param ctx the parse tree
	 */
	void enterFile(DLS_Parser.FileContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#file}.
	 * @param ctx the parse tree
	 */
	void exitFile(DLS_Parser.FileContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#attributes}.
	 * @param ctx the parse tree
	 */
	void enterAttributes(DLS_Parser.AttributesContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#attributes}.
	 * @param ctx the parse tree
	 */
	void exitAttributes(DLS_Parser.AttributesContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#attribute}.
	 * @param ctx the parse tree
	 */
	void enterAttribute(DLS_Parser.AttributeContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#attribute}.
	 * @param ctx the parse tree
	 */
	void exitAttribute(DLS_Parser.AttributeContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#pageGroup}.
	 * @param ctx the parse tree
	 */
	void enterPageGroup(DLS_Parser.PageGroupContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#pageGroup}.
	 * @param ctx the parse tree
	 */
	void exitPageGroup(DLS_Parser.PageGroupContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#pageGroupStart}.
	 * @param ctx the parse tree
	 */
	void enterPageGroupStart(DLS_Parser.PageGroupStartContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#pageGroupStart}.
	 * @param ctx the parse tree
	 */
	void exitPageGroupStart(DLS_Parser.PageGroupStartContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#page}.
	 * @param ctx the parse tree
	 */
	void enterPage(DLS_Parser.PageContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#page}.
	 * @param ctx the parse tree
	 */
	void exitPage(DLS_Parser.PageContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#pageStart}.
	 * @param ctx the parse tree
	 */
	void enterPageStart(DLS_Parser.PageStartContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#pageStart}.
	 * @param ctx the parse tree
	 */
	void exitPageStart(DLS_Parser.PageStartContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#question}.
	 * @param ctx the parse tree
	 */
	void enterQuestion(DLS_Parser.QuestionContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#question}.
	 * @param ctx the parse tree
	 */
	void exitQuestion(DLS_Parser.QuestionContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#oneDimensionalQuestion}.
	 * @param ctx the parse tree
	 */
	void enterOneDimensionalQuestion(DLS_Parser.OneDimensionalQuestionContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#oneDimensionalQuestion}.
	 * @param ctx the parse tree
	 */
	void exitOneDimensionalQuestion(DLS_Parser.OneDimensionalQuestionContext ctx);
	/**
	 * Enter a parse tree produced by {@link DLS_Parser#twoDimensionalQuestion}.
	 * @param ctx the parse tree
	 */
	void enterTwoDimensionalQuestion(DLS_Parser.TwoDimensionalQuestionContext ctx);
	/**
	 * Exit a parse tree produced by {@link DLS_Parser#twoDimensionalQuestion}.
	 * @param ctx the parse tree
	 */
	void exitTwoDimensionalQuestion(DLS_Parser.TwoDimensionalQuestionContext ctx);
}