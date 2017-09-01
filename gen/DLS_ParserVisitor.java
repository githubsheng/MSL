// Generated from /Users/wangsheng/Documents/antlr/MSL/src/main/g4/DLS/DLS_Parser.g4 by ANTLR 4.7
import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link DLS_Parser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface DLS_ParserVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#file}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFile(DLS_Parser.FileContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#attributes}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAttributes(DLS_Parser.AttributesContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#attribute}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAttribute(DLS_Parser.AttributeContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#pageGroup}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPageGroup(DLS_Parser.PageGroupContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#pageGroupStart}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPageGroupStart(DLS_Parser.PageGroupStartContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#page}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPage(DLS_Parser.PageContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#pageStart}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPageStart(DLS_Parser.PageStartContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#question}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQuestion(DLS_Parser.QuestionContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#oneDimensionalQuestion}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitOneDimensionalQuestion(DLS_Parser.OneDimensionalQuestionContext ctx);
	/**
	 * Visit a parse tree produced by {@link DLS_Parser#twoDimensionalQuestion}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTwoDimensionalQuestion(DLS_Parser.TwoDimensionalQuestionContext ctx);
}