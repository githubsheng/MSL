// Generated from /Users/wangsheng/Documents/antlr/MSL/src/main/g4/DLS/DLS_Lexer.g4 by ANTLR 4.7
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class DLS_Lexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.7", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		Open=1, Close=2, Equals=3, PageGroup=4, Page=5, SingleChoice=6, MultipleChoice=7, 
		SingleChoiceMatrix=8, MultipleChoiceMatrix=9, Row=10, Column=11, Submit=12, 
		End=13, Name=14, String=15;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	public static final String[] ruleNames = {
		"Open", "Close", "Equals", "PageGroup", "Page", "SingleChoice", "MultipleChoice", 
		"SingleChoiceMatrix", "MultipleChoiceMatrix", "Row", "Column", "Submit", 
		"End", "Name", "NameStartChar", "NameChar", "String", "DoubleStringCharacter", 
		"EscapeSequence", "CharacterEscapeSequence", "SingleEscapeCharacter", 
		"NonEscapeCharacter", "HexEscapeSequence", "UnicodeEscapeSequence", "HexDigit"
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


	public DLS_Lexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "DLS_Lexer.g4"; }

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

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\21\u00d7\b\1\4\2"+
		"\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4"+
		"\13\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22"+
		"\t\22\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31"+
		"\t\31\4\32\t\32\3\2\3\2\3\3\3\3\3\4\3\4\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3"+
		"\5\3\5\3\5\3\6\3\6\3\6\3\6\3\6\3\7\3\7\3\7\3\7\3\7\3\7\3\7\3\7\3\7\3\7"+
		"\3\7\3\7\3\7\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3"+
		"\b\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t"+
		"\3\t\3\t\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3"+
		"\n\3\n\3\n\3\n\3\n\3\n\3\13\3\13\3\13\3\13\3\f\3\f\3\f\3\f\3\r\3\r\3\r"+
		"\3\r\3\r\3\r\3\r\3\r\3\r\3\16\3\16\3\16\3\16\3\16\3\16\3\17\3\17\7\17"+
		"\u00a8\n\17\f\17\16\17\u00ab\13\17\3\20\3\20\3\21\3\21\3\22\3\22\7\22"+
		"\u00b3\n\22\f\22\16\22\u00b6\13\22\3\22\3\22\3\23\3\23\3\23\5\23\u00bd"+
		"\n\23\3\24\3\24\3\24\5\24\u00c2\n\24\3\25\3\25\5\25\u00c6\n\25\3\26\3"+
		"\26\3\27\3\27\3\30\3\30\3\30\3\30\3\31\3\31\3\31\3\31\3\31\3\31\3\32\3"+
		"\32\2\2\33\3\3\5\4\7\5\t\6\13\7\r\b\17\t\21\n\23\13\25\f\27\r\31\16\33"+
		"\17\35\20\37\2!\2#\21%\2\'\2)\2+\2-\2/\2\61\2\63\2\3\2\b\4\2C\\c|\5\2"+
		"\62;C\\c|\6\2\f\f\17\17$$^^\13\2$$))^^ddhhppttvvxx\16\2\f\f\17\17$$))"+
		"\62;^^ddhhppttvxzz\5\2\62;CHch\2\u00d2\2\3\3\2\2\2\2\5\3\2\2\2\2\7\3\2"+
		"\2\2\2\t\3\2\2\2\2\13\3\2\2\2\2\r\3\2\2\2\2\17\3\2\2\2\2\21\3\2\2\2\2"+
		"\23\3\2\2\2\2\25\3\2\2\2\2\27\3\2\2\2\2\31\3\2\2\2\2\33\3\2\2\2\2\35\3"+
		"\2\2\2\2#\3\2\2\2\3\65\3\2\2\2\5\67\3\2\2\2\79\3\2\2\2\t;\3\2\2\2\13E"+
		"\3\2\2\2\rJ\3\2\2\2\17W\3\2\2\2\21f\3\2\2\2\23y\3\2\2\2\25\u008e\3\2\2"+
		"\2\27\u0092\3\2\2\2\31\u0096\3\2\2\2\33\u009f\3\2\2\2\35\u00a5\3\2\2\2"+
		"\37\u00ac\3\2\2\2!\u00ae\3\2\2\2#\u00b0\3\2\2\2%\u00bc\3\2\2\2\'\u00c1"+
		"\3\2\2\2)\u00c5\3\2\2\2+\u00c7\3\2\2\2-\u00c9\3\2\2\2/\u00cb\3\2\2\2\61"+
		"\u00cf\3\2\2\2\63\u00d5\3\2\2\2\65\66\7]\2\2\66\4\3\2\2\2\678\7_\2\28"+
		"\6\3\2\2\29:\7?\2\2:\b\3\2\2\2;<\7R\2\2<=\7c\2\2=>\7i\2\2>?\7g\2\2?@\7"+
		"I\2\2@A\7t\2\2AB\7q\2\2BC\7w\2\2CD\7r\2\2D\n\3\2\2\2EF\7R\2\2FG\7c\2\2"+
		"GH\7i\2\2HI\7g\2\2I\f\3\2\2\2JK\7U\2\2KL\7k\2\2LM\7p\2\2MN\7i\2\2NO\7"+
		"n\2\2OP\7g\2\2PQ\7E\2\2QR\7j\2\2RS\7q\2\2ST\7k\2\2TU\7e\2\2UV\7g\2\2V"+
		"\16\3\2\2\2WX\7O\2\2XY\7w\2\2YZ\7n\2\2Z[\7v\2\2[\\\7k\2\2\\]\7r\2\2]^"+
		"\7n\2\2^_\7g\2\2_`\7E\2\2`a\7j\2\2ab\7q\2\2bc\7k\2\2cd\7e\2\2de\7g\2\2"+
		"e\20\3\2\2\2fg\7U\2\2gh\7k\2\2hi\7p\2\2ij\7i\2\2jk\7n\2\2kl\7g\2\2lm\7"+
		"E\2\2mn\7j\2\2no\7q\2\2op\7k\2\2pq\7e\2\2qr\7g\2\2rs\7O\2\2st\7c\2\2t"+
		"u\7v\2\2uv\7t\2\2vw\7k\2\2wx\7z\2\2x\22\3\2\2\2yz\7O\2\2z{\7w\2\2{|\7"+
		"n\2\2|}\7v\2\2}~\7k\2\2~\177\7r\2\2\177\u0080\7n\2\2\u0080\u0081\7g\2"+
		"\2\u0081\u0082\7E\2\2\u0082\u0083\7j\2\2\u0083\u0084\7q\2\2\u0084\u0085"+
		"\7k\2\2\u0085\u0086\7e\2\2\u0086\u0087\7g\2\2\u0087\u0088\7O\2\2\u0088"+
		"\u0089\7c\2\2\u0089\u008a\7v\2\2\u008a\u008b\7t\2\2\u008b\u008c\7k\2\2"+
		"\u008c\u008d\7z\2\2\u008d\24\3\2\2\2\u008e\u008f\7T\2\2\u008f\u0090\7"+
		"q\2\2\u0090\u0091\7y\2\2\u0091\26\3\2\2\2\u0092\u0093\7E\2\2\u0093\u0094"+
		"\7q\2\2\u0094\u0095\7n\2\2\u0095\30\3\2\2\2\u0096\u0097\7]\2\2\u0097\u0098"+
		"\7U\2\2\u0098\u0099\7w\2\2\u0099\u009a\7d\2\2\u009a\u009b\7o\2\2\u009b"+
		"\u009c\7k\2\2\u009c\u009d\7v\2\2\u009d\u009e\7_\2\2\u009e\32\3\2\2\2\u009f"+
		"\u00a0\7]\2\2\u00a0\u00a1\7G\2\2\u00a1\u00a2\7p\2\2\u00a2\u00a3\7f\2\2"+
		"\u00a3\u00a4\7_\2\2\u00a4\34\3\2\2\2\u00a5\u00a9\5\37\20\2\u00a6\u00a8"+
		"\5!\21\2\u00a7\u00a6\3\2\2\2\u00a8\u00ab\3\2\2\2\u00a9\u00a7\3\2\2\2\u00a9"+
		"\u00aa\3\2\2\2\u00aa\36\3\2\2\2\u00ab\u00a9\3\2\2\2\u00ac\u00ad\t\2\2"+
		"\2\u00ad \3\2\2\2\u00ae\u00af\t\3\2\2\u00af\"\3\2\2\2\u00b0\u00b4\7$\2"+
		"\2\u00b1\u00b3\5%\23\2\u00b2\u00b1\3\2\2\2\u00b3\u00b6\3\2\2\2\u00b4\u00b2"+
		"\3\2\2\2\u00b4\u00b5\3\2\2\2\u00b5\u00b7\3\2\2\2\u00b6\u00b4\3\2\2\2\u00b7"+
		"\u00b8\7$\2\2\u00b8$\3\2\2\2\u00b9\u00bd\n\4\2\2\u00ba\u00bb\7^\2\2\u00bb"+
		"\u00bd\5\'\24\2\u00bc\u00b9\3\2\2\2\u00bc\u00ba\3\2\2\2\u00bd&\3\2\2\2"+
		"\u00be\u00c2\5)\25\2\u00bf\u00c2\5/\30\2\u00c0\u00c2\5\61\31\2\u00c1\u00be"+
		"\3\2\2\2\u00c1\u00bf\3\2\2\2\u00c1\u00c0\3\2\2\2\u00c2(\3\2\2\2\u00c3"+
		"\u00c6\5+\26\2\u00c4\u00c6\5-\27\2\u00c5\u00c3\3\2\2\2\u00c5\u00c4\3\2"+
		"\2\2\u00c6*\3\2\2\2\u00c7\u00c8\t\5\2\2\u00c8,\3\2\2\2\u00c9\u00ca\n\6"+
		"\2\2\u00ca.\3\2\2\2\u00cb\u00cc\7z\2\2\u00cc\u00cd\5\63\32\2\u00cd\u00ce"+
		"\5\63\32\2\u00ce\60\3\2\2\2\u00cf\u00d0\7w\2\2\u00d0\u00d1\5\63\32\2\u00d1"+
		"\u00d2\5\63\32\2\u00d2\u00d3\5\63\32\2\u00d3\u00d4\5\63\32\2\u00d4\62"+
		"\3\2\2\2\u00d5\u00d6\t\7\2\2\u00d6\64\3\2\2\2\b\2\u00a9\u00b4\u00bc\u00c1"+
		"\u00c5\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}