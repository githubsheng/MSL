// Generated from TestLexer.g4 by ANTLR 4.7
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class TestLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.7", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		Placehoder=1, OutterMostRule=2, SomethingElse=3, InnerRule=4, Normal=5, 
		Special=6;
	public static final int
		MyMode=1;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE", "MyMode"
	};

	public static final String[] ruleNames = {
		"Placehoder", "OutterMostRule", "SomethingElse", "InnerRule", "Normal", 
		"Special"
	};

	private static final String[] _LITERAL_NAMES = {
		null, "'PlaceHolder'", null, "'SomethingElse'", "'Inner'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "Placehoder", "OutterMostRule", "SomethingElse", "InnerRule", "Normal", 
		"Special"
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


	public TestLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "TestLexer.g4"; }

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
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\bA\b\1\b\1\4\2\t"+
		"\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\3\2\3\2\3\2\3\2\3\2\3\2\3\2"+
		"\3\2\3\2\3\2\3\2\3\2\3\3\3\3\3\3\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3"+
		"\4\3\4\3\4\3\4\3\4\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\6\3\6\3\6\3\6\3\6"+
		"\3\6\3\7\3\7\3\7\3\7\3\7\3\7\2\2\b\4\3\6\4\b\5\n\6\f\7\16\b\4\2\3\2\2"+
		"?\2\4\3\2\2\2\2\6\3\2\2\2\2\b\3\2\2\2\2\n\3\2\2\2\2\f\3\2\2\2\3\16\3\2"+
		"\2\2\4\20\3\2\2\2\6\34\3\2\2\2\b\37\3\2\2\2\n-\3\2\2\2\f\65\3\2\2\2\16"+
		";\3\2\2\2\20\21\7R\2\2\21\22\7n\2\2\22\23\7c\2\2\23\24\7e\2\2\24\25\7"+
		"g\2\2\25\26\7J\2\2\26\27\7q\2\2\27\30\7n\2\2\30\31\7f\2\2\31\32\7g\2\2"+
		"\32\33\7t\2\2\33\5\3\2\2\2\34\35\5\b\4\2\35\36\5\n\5\2\36\7\3\2\2\2\37"+
		" \7U\2\2 !\7q\2\2!\"\7o\2\2\"#\7g\2\2#$\7v\2\2$%\7j\2\2%&\7k\2\2&\'\7"+
		"p\2\2\'(\7i\2\2()\7G\2\2)*\7n\2\2*+\7u\2\2+,\7g\2\2,\t\3\2\2\2-.\7K\2"+
		"\2./\7p\2\2/\60\7p\2\2\60\61\7g\2\2\61\62\7t\2\2\62\63\3\2\2\2\63\64\b"+
		"\5\2\2\64\13\3\2\2\2\65\66\7U\2\2\66\67\7j\2\2\678\7g\2\289\7p\2\29:\7"+
		"i\2\2:\r\3\2\2\2;<\7U\2\2<=\7j\2\2=>\7g\2\2>?\7p\2\2?@\7i\2\2@\17\3\2"+
		"\2\2\4\2\3\3\7\3\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}