// Generated from /Users/wangsheng/Documents/antlr/MSL/src/main/g4/DLS/DLS_Parser.g4 by ANTLR 4.7
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class DLS_Parser extends Parser {
	static { RuntimeMetaData.checkVersion("4.7", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		Open=1, Close=2, Equals=3, PageGroup=4, Page=5, SingleChoice=6, MultipleChoice=7, 
		SingleChoiceMatrix=8, MultipleChoiceMatrix=9, Row=10, Column=11, Submit=12, 
		End=13, Name=14, String=15;
	public static final int
		RULE_file = 0, RULE_attributes = 1, RULE_attribute = 2, RULE_pageGroup = 3, 
		RULE_pageGroupStart = 4, RULE_page = 5, RULE_pageStart = 6, RULE_question = 7, 
		RULE_oneDimensionalQuestion = 8, RULE_twoDimensionalQuestion = 9;
	public static final String[] ruleNames = {
		"file", "attributes", "attribute", "pageGroup", "pageGroupStart", "page", 
		"pageStart", "question", "oneDimensionalQuestion", "twoDimensionalQuestion"
	};

	private static final String[] _LITERAL_NAMES = {
		null, "'['", "']'", "'='", "'PageGroup'", "'Page'", "'SingleChoice'", 
		"'MultipleChoice'", "'SingleChoiceMatrix'", "'MultipleChoiceMatrix'", 
		"'Row'", "'Col'", "'[Submit]'", "'[End]'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "Open", "Close", "Equals", "PageGroup", "Page", "SingleChoice", 
		"MultipleChoice", "SingleChoiceMatrix", "MultipleChoiceMatrix", "Row", 
		"Column", "Submit", "End", "Name", "String"
	};
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "DLS_Parser.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public DLS_Parser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}
	public static class FileContext extends ParserRuleContext {
		public List<PageContext> page() {
			return getRuleContexts(PageContext.class);
		}
		public PageContext page(int i) {
			return getRuleContext(PageContext.class,i);
		}
		public List<PageGroupContext> pageGroup() {
			return getRuleContexts(PageGroupContext.class);
		}
		public PageGroupContext pageGroup(int i) {
			return getRuleContext(PageGroupContext.class,i);
		}
		public FileContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_file; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterFile(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitFile(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitFile(this);
			else return visitor.visitChildren(this);
		}
	}

	public final FileContext file() throws RecognitionException {
		FileContext _localctx = new FileContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_file);
		int _la;
		try {
			setState(32);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,2,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(23);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==Open) {
					{
					{
					setState(20);
					page();
					}
					}
					setState(25);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(29);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==Open) {
					{
					{
					setState(26);
					pageGroup();
					}
					}
					setState(31);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AttributesContext extends ParserRuleContext {
		public List<AttributeContext> attribute() {
			return getRuleContexts(AttributeContext.class);
		}
		public AttributeContext attribute(int i) {
			return getRuleContext(AttributeContext.class,i);
		}
		public AttributesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_attributes; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterAttributes(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitAttributes(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitAttributes(this);
			else return visitor.visitChildren(this);
		}
	}

	public final AttributesContext attributes() throws RecognitionException {
		AttributesContext _localctx = new AttributesContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_attributes);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(37);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==Name) {
				{
				{
				setState(34);
				attribute();
				}
				}
				setState(39);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AttributeContext extends ParserRuleContext {
		public TerminalNode Name() { return getToken(DLS_Parser.Name, 0); }
		public TerminalNode Equals() { return getToken(DLS_Parser.Equals, 0); }
		public TerminalNode String() { return getToken(DLS_Parser.String, 0); }
		public AttributeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_attribute; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterAttribute(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitAttribute(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitAttribute(this);
			else return visitor.visitChildren(this);
		}
	}

	public final AttributeContext attribute() throws RecognitionException {
		AttributeContext _localctx = new AttributeContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_attribute);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(40);
			match(Name);
			setState(41);
			match(Equals);
			setState(42);
			match(String);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PageGroupContext extends ParserRuleContext {
		public PageGroupStartContext pageGroupStart() {
			return getRuleContext(PageGroupStartContext.class,0);
		}
		public TerminalNode End() { return getToken(DLS_Parser.End, 0); }
		public List<PageContext> page() {
			return getRuleContexts(PageContext.class);
		}
		public PageContext page(int i) {
			return getRuleContext(PageContext.class,i);
		}
		public PageGroupContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pageGroup; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterPageGroup(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitPageGroup(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitPageGroup(this);
			else return visitor.visitChildren(this);
		}
	}

	public final PageGroupContext pageGroup() throws RecognitionException {
		PageGroupContext _localctx = new PageGroupContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_pageGroup);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(44);
			pageGroupStart();
			setState(48);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==Open) {
				{
				{
				setState(45);
				page();
				}
				}
				setState(50);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(51);
			match(End);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PageGroupStartContext extends ParserRuleContext {
		public TerminalNode Open() { return getToken(DLS_Parser.Open, 0); }
		public TerminalNode PageGroup() { return getToken(DLS_Parser.PageGroup, 0); }
		public AttributesContext attributes() {
			return getRuleContext(AttributesContext.class,0);
		}
		public TerminalNode End() { return getToken(DLS_Parser.End, 0); }
		public PageGroupStartContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pageGroupStart; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterPageGroupStart(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitPageGroupStart(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitPageGroupStart(this);
			else return visitor.visitChildren(this);
		}
	}

	public final PageGroupStartContext pageGroupStart() throws RecognitionException {
		PageGroupStartContext _localctx = new PageGroupStartContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_pageGroupStart);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(53);
			match(Open);
			setState(54);
			match(PageGroup);
			setState(55);
			attributes();
			setState(56);
			match(End);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PageContext extends ParserRuleContext {
		public PageStartContext pageStart() {
			return getRuleContext(PageStartContext.class,0);
		}
		public TerminalNode End() { return getToken(DLS_Parser.End, 0); }
		public List<QuestionContext> question() {
			return getRuleContexts(QuestionContext.class);
		}
		public QuestionContext question(int i) {
			return getRuleContext(QuestionContext.class,i);
		}
		public TerminalNode Submit() { return getToken(DLS_Parser.Submit, 0); }
		public PageContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_page; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterPage(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitPage(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitPage(this);
			else return visitor.visitChildren(this);
		}
	}

	public final PageContext page() throws RecognitionException {
		PageContext _localctx = new PageContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_page);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(58);
			pageStart();
			setState(60); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(59);
				question();
				}
				}
				setState(62); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << SingleChoice) | (1L << MultipleChoice) | (1L << SingleChoiceMatrix) | (1L << MultipleChoiceMatrix))) != 0) );
			setState(65);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Submit) {
				{
				setState(64);
				match(Submit);
				}
			}

			setState(67);
			match(End);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PageStartContext extends ParserRuleContext {
		public TerminalNode Open() { return getToken(DLS_Parser.Open, 0); }
		public TerminalNode Page() { return getToken(DLS_Parser.Page, 0); }
		public AttributesContext attributes() {
			return getRuleContext(AttributesContext.class,0);
		}
		public TerminalNode End() { return getToken(DLS_Parser.End, 0); }
		public PageStartContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pageStart; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterPageStart(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitPageStart(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitPageStart(this);
			else return visitor.visitChildren(this);
		}
	}

	public final PageStartContext pageStart() throws RecognitionException {
		PageStartContext _localctx = new PageStartContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_pageStart);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(69);
			match(Open);
			setState(70);
			match(Page);
			setState(71);
			attributes();
			setState(72);
			match(End);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QuestionContext extends ParserRuleContext {
		public OneDimensionalQuestionContext oneDimensionalQuestion() {
			return getRuleContext(OneDimensionalQuestionContext.class,0);
		}
		public TwoDimensionalQuestionContext twoDimensionalQuestion() {
			return getRuleContext(TwoDimensionalQuestionContext.class,0);
		}
		public QuestionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_question; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterQuestion(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitQuestion(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitQuestion(this);
			else return visitor.visitChildren(this);
		}
	}

	public final QuestionContext question() throws RecognitionException {
		QuestionContext _localctx = new QuestionContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_question);
		try {
			setState(76);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SingleChoice:
			case MultipleChoice:
				enterOuterAlt(_localctx, 1);
				{
				setState(74);
				oneDimensionalQuestion();
				}
				break;
			case SingleChoiceMatrix:
			case MultipleChoiceMatrix:
				enterOuterAlt(_localctx, 2);
				{
				setState(75);
				twoDimensionalQuestion();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class OneDimensionalQuestionContext extends ParserRuleContext {
		public TerminalNode SingleChoice() { return getToken(DLS_Parser.SingleChoice, 0); }
		public TerminalNode MultipleChoice() { return getToken(DLS_Parser.MultipleChoice, 0); }
		public List<TerminalNode> Row() { return getTokens(DLS_Parser.Row); }
		public TerminalNode Row(int i) {
			return getToken(DLS_Parser.Row, i);
		}
		public OneDimensionalQuestionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_oneDimensionalQuestion; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterOneDimensionalQuestion(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitOneDimensionalQuestion(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitOneDimensionalQuestion(this);
			else return visitor.visitChildren(this);
		}
	}

	public final OneDimensionalQuestionContext oneDimensionalQuestion() throws RecognitionException {
		OneDimensionalQuestionContext _localctx = new OneDimensionalQuestionContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_oneDimensionalQuestion);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(78);
			_la = _input.LA(1);
			if ( !(_la==SingleChoice || _la==MultipleChoice) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(80); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(79);
				match(Row);
				}
				}
				setState(82); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==Row );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TwoDimensionalQuestionContext extends ParserRuleContext {
		public TerminalNode SingleChoiceMatrix() { return getToken(DLS_Parser.SingleChoiceMatrix, 0); }
		public TerminalNode MultipleChoiceMatrix() { return getToken(DLS_Parser.MultipleChoiceMatrix, 0); }
		public List<TerminalNode> Row() { return getTokens(DLS_Parser.Row); }
		public TerminalNode Row(int i) {
			return getToken(DLS_Parser.Row, i);
		}
		public List<TerminalNode> Column() { return getTokens(DLS_Parser.Column); }
		public TerminalNode Column(int i) {
			return getToken(DLS_Parser.Column, i);
		}
		public TwoDimensionalQuestionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_twoDimensionalQuestion; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).enterTwoDimensionalQuestion(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof DLS_ParserListener ) ((DLS_ParserListener)listener).exitTwoDimensionalQuestion(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof DLS_ParserVisitor ) return ((DLS_ParserVisitor<? extends T>)visitor).visitTwoDimensionalQuestion(this);
			else return visitor.visitChildren(this);
		}
	}

	public final TwoDimensionalQuestionContext twoDimensionalQuestion() throws RecognitionException {
		TwoDimensionalQuestionContext _localctx = new TwoDimensionalQuestionContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_twoDimensionalQuestion);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(84);
			_la = _input.LA(1);
			if ( !(_la==SingleChoiceMatrix || _la==MultipleChoiceMatrix) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(86); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(85);
				match(Row);
				}
				}
				setState(88); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==Row );
			setState(91); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(90);
				match(Column);
				}
				}
				setState(93); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==Column );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\21b\4\2\t\2\4\3\t"+
		"\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t\13\3"+
		"\2\7\2\30\n\2\f\2\16\2\33\13\2\3\2\7\2\36\n\2\f\2\16\2!\13\2\5\2#\n\2"+
		"\3\3\7\3&\n\3\f\3\16\3)\13\3\3\4\3\4\3\4\3\4\3\5\3\5\7\5\61\n\5\f\5\16"+
		"\5\64\13\5\3\5\3\5\3\6\3\6\3\6\3\6\3\6\3\7\3\7\6\7?\n\7\r\7\16\7@\3\7"+
		"\5\7D\n\7\3\7\3\7\3\b\3\b\3\b\3\b\3\b\3\t\3\t\5\tO\n\t\3\n\3\n\6\nS\n"+
		"\n\r\n\16\nT\3\13\3\13\6\13Y\n\13\r\13\16\13Z\3\13\6\13^\n\13\r\13\16"+
		"\13_\3\13\2\2\f\2\4\6\b\n\f\16\20\22\24\2\4\3\2\b\t\3\2\n\13\2b\2\"\3"+
		"\2\2\2\4\'\3\2\2\2\6*\3\2\2\2\b.\3\2\2\2\n\67\3\2\2\2\f<\3\2\2\2\16G\3"+
		"\2\2\2\20N\3\2\2\2\22P\3\2\2\2\24V\3\2\2\2\26\30\5\f\7\2\27\26\3\2\2\2"+
		"\30\33\3\2\2\2\31\27\3\2\2\2\31\32\3\2\2\2\32#\3\2\2\2\33\31\3\2\2\2\34"+
		"\36\5\b\5\2\35\34\3\2\2\2\36!\3\2\2\2\37\35\3\2\2\2\37 \3\2\2\2 #\3\2"+
		"\2\2!\37\3\2\2\2\"\31\3\2\2\2\"\37\3\2\2\2#\3\3\2\2\2$&\5\6\4\2%$\3\2"+
		"\2\2&)\3\2\2\2\'%\3\2\2\2\'(\3\2\2\2(\5\3\2\2\2)\'\3\2\2\2*+\7\20\2\2"+
		"+,\7\5\2\2,-\7\21\2\2-\7\3\2\2\2.\62\5\n\6\2/\61\5\f\7\2\60/\3\2\2\2\61"+
		"\64\3\2\2\2\62\60\3\2\2\2\62\63\3\2\2\2\63\65\3\2\2\2\64\62\3\2\2\2\65"+
		"\66\7\17\2\2\66\t\3\2\2\2\678\7\3\2\289\7\6\2\29:\5\4\3\2:;\7\17\2\2;"+
		"\13\3\2\2\2<>\5\16\b\2=?\5\20\t\2>=\3\2\2\2?@\3\2\2\2@>\3\2\2\2@A\3\2"+
		"\2\2AC\3\2\2\2BD\7\16\2\2CB\3\2\2\2CD\3\2\2\2DE\3\2\2\2EF\7\17\2\2F\r"+
		"\3\2\2\2GH\7\3\2\2HI\7\7\2\2IJ\5\4\3\2JK\7\17\2\2K\17\3\2\2\2LO\5\22\n"+
		"\2MO\5\24\13\2NL\3\2\2\2NM\3\2\2\2O\21\3\2\2\2PR\t\2\2\2QS\7\f\2\2RQ\3"+
		"\2\2\2ST\3\2\2\2TR\3\2\2\2TU\3\2\2\2U\23\3\2\2\2VX\t\3\2\2WY\7\f\2\2X"+
		"W\3\2\2\2YZ\3\2\2\2ZX\3\2\2\2Z[\3\2\2\2[]\3\2\2\2\\^\7\r\2\2]\\\3\2\2"+
		"\2^_\3\2\2\2_]\3\2\2\2_`\3\2\2\2`\25\3\2\2\2\r\31\37\"\'\62@CNTZ_";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}