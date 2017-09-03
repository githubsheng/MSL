// Generated from DLSLexer.g4 by ANTLR 4.7
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class DLSLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.7", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		WS=1, PageGroupStart=2, PageStart=3, EndPageGroup=4, TagModeWS=5, Name=6, 
		String=7, BindingOpen=8, Equals=9, Close=10, RowStart=11, ColStart=12, 
		TextArea=13, TextAreaEnd=14, SubmitButton=15, ScriptModeWS=16, BindingClose=17, 
		SingleChoiceStart=18, MultipleChoiceStart=19, SingleChoiceMatrixStart=20, 
		EndPage=21, Token=22;
	public static final int
		TagMode=1, TextAreaMode=2, ScriptMode=3;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE", "TagMode", "TextAreaMode", "ScriptMode"
	};

	public static final String[] ruleNames = {
		"WS", "PageGroupStart", "PageStart", "EndPageGroup", "TagModeWS", "Name", 
		"NameStartChar", "NameChar", "String", "BindingOpen", "Equals", "DoubleStringCharacter", 
		"EscapeSequence", "CharacterEscapeSequence", "SingleEscapeCharacter", 
		"NonEscapeCharacter", "HexEscapeSequence", "UnicodeEscapeSequence", "HexDigit", 
		"Close", "RowStart", "ColStart", "TextArea", "TextAreaEnd", "SubmitButton", 
		"ScriptModeWS", "BindingClose", "SingleChoiceStart", "MultipleChoiceStart", 
		"SingleChoiceMatrixStart", "EndPage", "Token"
	};

	private static final String[] _LITERAL_NAMES = {
		null, null, "'[PageGroup'", null, "'EndPageGroup]'", null, null, null, 
		"'{'", "'='", "']'", "'[Row'", "'[Col'", null, null, "'[Submit]'", null, 
		"'}'", null, null, null, "'[PageEnd]'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "WS", "PageGroupStart", "PageStart", "EndPageGroup", "TagModeWS", 
		"Name", "String", "BindingOpen", "Equals", "Close", "RowStart", "ColStart", 
		"TextArea", "TextAreaEnd", "SubmitButton", "ScriptModeWS", "BindingClose", 
		"SingleChoiceStart", "MultipleChoiceStart", "SingleChoiceMatrixStart", 
		"EndPage", "Token"
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


	public DLSLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "DLSLexer.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	@Override
	public void action(RuleContext _localctx, int ruleIndex, int actionIndex) {
		switch (ruleIndex) {
		case 22:
			TextArea_action((RuleContext)_localctx, actionIndex);
			break;
		}
	}
	private void TextArea_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 0:

			     int offSet = 0;
			     String matched = getText();
			     if(matched.endsWith("[Row")) {
			        offSet = 4;
			        pushMode(TagMode);
			     }
			     if(matched.endsWith("[Column")) {
			        offSet = 7;
			        pushMode(TagMode);
			     }
			     if(matched.endsWith("[Submit")) {
			        offSet = 7;
			        popMode();
			        pushMode(ScriptMode);
			     }
			     if(matched.endsWith("[SingleChoice")) {
			        offSet = 13;
			        popMode();
			        pushMode(ScriptMode);
			     }
			     int idx = _input.index();
			     _input.seek(idx - offSet);

			break;
		}
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\30\u0138\b\1\b\1"+
		"\b\1\b\1\4\2\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t"+
		"\t\4\n\t\n\4\13\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21"+
		"\t\21\4\22\t\22\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30"+
		"\t\30\4\31\t\31\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37"+
		"\t\37\4 \t \4!\t!\3\2\6\2H\n\2\r\2\16\2I\3\2\3\2\3\3\3\3\3\3\3\3\3\3\3"+
		"\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\5"+
		"\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\6\3\6\3\6\3\6\3"+
		"\7\3\7\7\7x\n\7\f\7\16\7{\13\7\3\b\3\b\3\t\3\t\3\n\3\n\7\n\u0083\n\n\f"+
		"\n\16\n\u0086\13\n\3\n\3\n\3\13\3\13\3\13\3\13\3\f\3\f\3\r\3\r\3\r\5\r"+
		"\u0093\n\r\3\16\3\16\3\16\5\16\u0098\n\16\3\17\3\17\5\17\u009c\n\17\3"+
		"\20\3\20\3\21\3\21\3\22\3\22\3\22\3\22\3\23\3\23\3\23\3\23\3\23\3\23\3"+
		"\24\3\24\3\25\3\25\3\25\3\25\3\26\3\26\3\26\3\26\3\26\3\27\3\27\3\27\3"+
		"\27\3\27\3\30\6\30\u00bd\n\30\r\30\16\30\u00be\3\30\3\30\3\30\3\31\3\31"+
		"\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31"+
		"\3\31\3\31\3\31\5\31\u00d7\n\31\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\32"+
		"\3\32\3\33\3\33\3\33\3\33\3\34\3\34\3\34\3\34\3\35\3\35\3\35\3\35\3\35"+
		"\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\36"+
		"\3\36\3\36\3\36\3\36\3\36\3\36\3\36\3\36\3\36\3\36\3\36\3\36\3\36\3\36"+
		"\3\36\3\36\3\36\3\36\3\36\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37"+
		"\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37\3\37"+
		"\3\37\3 \3 \3 \3 \3 \3 \3 \3 \3 \3 \3 \3 \3!\6!\u0135\n!\r!\16!\u0136"+
		"\3\u00be\2\"\6\3\b\4\n\5\f\6\16\7\20\b\22\2\24\2\26\t\30\n\32\13\34\2"+
		"\36\2 \2\"\2$\2&\2(\2*\2,\f.\r\60\16\62\17\64\20\66\218\22:\23<\24>\25"+
		"@\26B\27D\30\6\2\3\4\5\t\5\2\13\f\17\17\"\"\4\2C\\c|\5\2\62;C\\c|\6\2"+
		"\f\f\17\17$$^^\13\2$$))^^ddhhppttvvxx\16\2\f\f\17\17$$))\62;^^ddhhppt"+
		"tvxzz\5\2\62;CHch\2\u0136\2\6\3\2\2\2\2\b\3\2\2\2\2\n\3\2\2\2\2\f\3\2"+
		"\2\2\3\16\3\2\2\2\3\20\3\2\2\2\3\26\3\2\2\2\3\30\3\2\2\2\3\32\3\2\2\2"+
		"\3,\3\2\2\2\3.\3\2\2\2\3\60\3\2\2\2\4\62\3\2\2\2\4\64\3\2\2\2\5\66\3\2"+
		"\2\2\58\3\2\2\2\5:\3\2\2\2\5<\3\2\2\2\5>\3\2\2\2\5@\3\2\2\2\5B\3\2\2\2"+
		"\5D\3\2\2\2\6G\3\2\2\2\bM\3\2\2\2\nZ\3\2\2\2\fc\3\2\2\2\16q\3\2\2\2\20"+
		"u\3\2\2\2\22|\3\2\2\2\24~\3\2\2\2\26\u0080\3\2\2\2\30\u0089\3\2\2\2\32"+
		"\u008d\3\2\2\2\34\u0092\3\2\2\2\36\u0097\3\2\2\2 \u009b\3\2\2\2\"\u009d"+
		"\3\2\2\2$\u009f\3\2\2\2&\u00a1\3\2\2\2(\u00a5\3\2\2\2*\u00ab\3\2\2\2,"+
		"\u00ad\3\2\2\2.\u00b1\3\2\2\2\60\u00b6\3\2\2\2\62\u00bc\3\2\2\2\64\u00d6"+
		"\3\2\2\2\66\u00d8\3\2\2\28\u00e1\3\2\2\2:\u00e5\3\2\2\2<\u00e9\3\2\2\2"+
		">\u00fb\3\2\2\2@\u010f\3\2\2\2B\u0127\3\2\2\2D\u0134\3\2\2\2FH\t\2\2\2"+
		"GF\3\2\2\2HI\3\2\2\2IG\3\2\2\2IJ\3\2\2\2JK\3\2\2\2KL\b\2\2\2L\7\3\2\2"+
		"\2MN\7]\2\2NO\7R\2\2OP\7c\2\2PQ\7i\2\2QR\7g\2\2RS\7I\2\2ST\7t\2\2TU\7"+
		"q\2\2UV\7w\2\2VW\7r\2\2WX\3\2\2\2XY\b\3\3\2Y\t\3\2\2\2Z[\7]\2\2[\\\7R"+
		"\2\2\\]\7c\2\2]^\7i\2\2^_\7g\2\2_`\3\2\2\2`a\b\4\4\2ab\b\4\3\2b\13\3\2"+
		"\2\2cd\7G\2\2de\7p\2\2ef\7f\2\2fg\7R\2\2gh\7c\2\2hi\7i\2\2ij\7g\2\2jk"+
		"\7I\2\2kl\7t\2\2lm\7q\2\2mn\7w\2\2no\7r\2\2op\7_\2\2p\r\3\2\2\2qr\5\6"+
		"\2\2rs\3\2\2\2st\b\6\2\2t\17\3\2\2\2uy\5\22\b\2vx\5\24\t\2wv\3\2\2\2x"+
		"{\3\2\2\2yw\3\2\2\2yz\3\2\2\2z\21\3\2\2\2{y\3\2\2\2|}\t\3\2\2}\23\3\2"+
		"\2\2~\177\t\4\2\2\177\25\3\2\2\2\u0080\u0084\7$\2\2\u0081\u0083\5\34\r"+
		"\2\u0082\u0081\3\2\2\2\u0083\u0086\3\2\2\2\u0084\u0082\3\2\2\2\u0084\u0085"+
		"\3\2\2\2\u0085\u0087\3\2\2\2\u0086\u0084\3\2\2\2\u0087\u0088\7$\2\2\u0088"+
		"\27\3\2\2\2\u0089\u008a\7}\2\2\u008a\u008b\3\2\2\2\u008b\u008c\b\13\4"+
		"\2\u008c\31\3\2\2\2\u008d\u008e\7?\2\2\u008e\33\3\2\2\2\u008f\u0093\n"+
		"\5\2\2\u0090\u0091\7^\2\2\u0091\u0093\5\36\16\2\u0092\u008f\3\2\2\2\u0092"+
		"\u0090\3\2\2\2\u0093\35\3\2\2\2\u0094\u0098\5 \17\2\u0095\u0098\5&\22"+
		"\2\u0096\u0098\5(\23\2\u0097\u0094\3\2\2\2\u0097\u0095\3\2\2\2\u0097\u0096"+
		"\3\2\2\2\u0098\37\3\2\2\2\u0099\u009c\5\"\20\2\u009a\u009c\5$\21\2\u009b"+
		"\u0099\3\2\2\2\u009b\u009a\3\2\2\2\u009c!\3\2\2\2\u009d\u009e\t\6\2\2"+
		"\u009e#\3\2\2\2\u009f\u00a0\n\7\2\2\u00a0%\3\2\2\2\u00a1\u00a2\7z\2\2"+
		"\u00a2\u00a3\5*\24\2\u00a3\u00a4\5*\24\2\u00a4\'\3\2\2\2\u00a5\u00a6\7"+
		"w\2\2\u00a6\u00a7\5*\24\2\u00a7\u00a8\5*\24\2\u00a8\u00a9\5*\24\2\u00a9"+
		"\u00aa\5*\24\2\u00aa)\3\2\2\2\u00ab\u00ac\t\b\2\2\u00ac+\3\2\2\2\u00ad"+
		"\u00ae\7_\2\2\u00ae\u00af\3\2\2\2\u00af\u00b0\b\25\5\2\u00b0-\3\2\2\2"+
		"\u00b1\u00b2\7]\2\2\u00b2\u00b3\7T\2\2\u00b3\u00b4\7q\2\2\u00b4\u00b5"+
		"\7y\2\2\u00b5/\3\2\2\2\u00b6\u00b7\7]\2\2\u00b7\u00b8\7E\2\2\u00b8\u00b9"+
		"\7q\2\2\u00b9\u00ba\7n\2\2\u00ba\61\3\2\2\2\u00bb\u00bd\13\2\2\2\u00bc"+
		"\u00bb\3\2\2\2\u00bd\u00be\3\2\2\2\u00be\u00bf\3\2\2\2\u00be\u00bc\3\2"+
		"\2\2\u00bf\u00c0\3\2\2\2\u00c0\u00c1\5\64\31\2\u00c1\u00c2\b\30\6\2\u00c2"+
		"\63\3\2\2\2\u00c3\u00c4\7]\2\2\u00c4\u00c5\7T\2\2\u00c5\u00c6\7q\2\2\u00c6"+
		"\u00d7\7y\2\2\u00c7\u00c8\7]\2\2\u00c8\u00c9\7E\2\2\u00c9\u00ca\7q\2\2"+
		"\u00ca\u00cb\7n\2\2\u00cb\u00cc\7w\2\2\u00cc\u00cd\7o\2\2\u00cd\u00d7"+
		"\7p\2\2\u00ce\u00cf\7]\2\2\u00cf\u00d0\7U\2\2\u00d0\u00d1\7w\2\2\u00d1"+
		"\u00d2\7d\2\2\u00d2\u00d3\7o\2\2\u00d3\u00d4\7k\2\2\u00d4\u00d7\7v\2\2"+
		"\u00d5\u00d7\5<\35\2\u00d6\u00c3\3\2\2\2\u00d6\u00c7\3\2\2\2\u00d6\u00ce"+
		"\3\2\2\2\u00d6\u00d5\3\2\2\2\u00d7\65\3\2\2\2\u00d8\u00d9\7]\2\2\u00d9"+
		"\u00da\7U\2\2\u00da\u00db\7w\2\2\u00db\u00dc\7d\2\2\u00dc\u00dd\7o\2\2"+
		"\u00dd\u00de\7k\2\2\u00de\u00df\7v\2\2\u00df\u00e0\7_\2\2\u00e0\67\3\2"+
		"\2\2\u00e1\u00e2\5\6\2\2\u00e2\u00e3\3\2\2\2\u00e3\u00e4\b\33\2\2\u00e4"+
		"9\3\2\2\2\u00e5\u00e6\7\177\2\2\u00e6\u00e7\3\2\2\2\u00e7\u00e8\b\34\5"+
		"\2\u00e8;\3\2\2\2\u00e9\u00ea\7]\2\2\u00ea\u00eb\7U\2\2\u00eb\u00ec\7"+
		"k\2\2\u00ec\u00ed\7p\2\2\u00ed\u00ee\7i\2\2\u00ee\u00ef\7n\2\2\u00ef\u00f0"+
		"\7g\2\2\u00f0\u00f1\7E\2\2\u00f1\u00f2\7j\2\2\u00f2\u00f3\7q\2\2\u00f3"+
		"\u00f4\7k\2\2\u00f4\u00f5\7e\2\2\u00f5\u00f6\7g\2\2\u00f6\u00f7\3\2\2"+
		"\2\u00f7\u00f8\b\35\5\2\u00f8\u00f9\b\35\7\2\u00f9\u00fa\b\35\3\2\u00fa"+
		"=\3\2\2\2\u00fb\u00fc\7]\2\2\u00fc\u00fd\7O\2\2\u00fd\u00fe\7w\2\2\u00fe"+
		"\u00ff\7n\2\2\u00ff\u0100\7v\2\2\u0100\u0101\7k\2\2\u0101\u0102\7r\2\2"+
		"\u0102\u0103\7n\2\2\u0103\u0104\7g\2\2\u0104\u0105\7E\2\2\u0105\u0106"+
		"\7j\2\2\u0106\u0107\7q\2\2\u0107\u0108\7k\2\2\u0108\u0109\7e\2\2\u0109"+
		"\u010a\7g\2\2\u010a\u010b\3\2\2\2\u010b\u010c\b\36\5\2\u010c\u010d\b\36"+
		"\7\2\u010d\u010e\b\36\3\2\u010e?\3\2\2\2\u010f\u0110\7]\2\2\u0110\u0111"+
		"\7U\2\2\u0111\u0112\7k\2\2\u0112\u0113\7p\2\2\u0113\u0114\7i\2\2\u0114"+
		"\u0115\7n\2\2\u0115\u0116\7g\2\2\u0116\u0117\7E\2\2\u0117\u0118\7j\2\2"+
		"\u0118\u0119\7q\2\2\u0119\u011a\7k\2\2\u011a\u011b\7e\2\2\u011b\u011c"+
		"\7g\2\2\u011c\u011d\7O\2\2\u011d\u011e\7c\2\2\u011e\u011f\7v\2\2\u011f"+
		"\u0120\7t\2\2\u0120\u0121\7k\2\2\u0121\u0122\7z\2\2\u0122\u0123\3\2\2"+
		"\2\u0123\u0124\b\37\5\2\u0124\u0125\b\37\7\2\u0125\u0126\b\37\3\2\u0126"+
		"A\3\2\2\2\u0127\u0128\7]\2\2\u0128\u0129\7R\2\2\u0129\u012a\7c\2\2\u012a"+
		"\u012b\7i\2\2\u012b\u012c\7g\2\2\u012c\u012d\7G\2\2\u012d\u012e\7p\2\2"+
		"\u012e\u012f\7f\2\2\u012f\u0130\7_\2\2\u0130\u0131\3\2\2\2\u0131\u0132"+
		"\b \5\2\u0132C\3\2\2\2\u0133\u0135\t\3\2\2\u0134\u0133\3\2\2\2\u0135\u0136"+
		"\3\2\2\2\u0136\u0134\3\2\2\2\u0136\u0137\3\2\2\2\u0137E\3\2\2\2\17\2\3"+
		"\4\5Iy\u0084\u0092\u0097\u009b\u00be\u00d6\u0136\b\b\2\2\7\3\2\7\5\2\6"+
		"\2\2\3\30\2\7\4\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}