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
		TextArea=1, Ends=2, RowStart=3, ColStart=4, WS=5, Name=6, Close=7;
	public static final int
		TagMode=1;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE", "TagMode"
	};

	public static final String[] ruleNames = {
		"TextArea", "Ends", "RowStart", "ColStart", "WS", "Name", "Close"
	};

	private static final String[] _LITERAL_NAMES = {
		null, null, null, "'[Row'", "'[Column'", null, null, "']'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "TextArea", "Ends", "RowStart", "ColStart", "WS", "Name", "Close"
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

	@Override
	public void action(RuleContext _localctx, int ruleIndex, int actionIndex) {
		switch (ruleIndex) {
		case 0:
			TextArea_action((RuleContext)_localctx, actionIndex);
			break;
		}
	}
	private void TextArea_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 0:

			     System.out.println("match!!!");
			     String matched = getText();
			     int offSet = 0;
			     if(matched.endsWith("Row")) offSet = 4;
			     if(matched.endsWith("Column")) offSet = 7;
			     pushMode(TagMode);
			     int idx = _input.index();
			     _input.seek(idx - offSet);

			break;
		}
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\tD\b\1\b\1\4\2\t"+
		"\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\3\2\6\2\24\n\2\r\2"+
		"\16\2\25\3\2\3\2\3\2\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\5\3&"+
		"\n\3\3\4\3\4\3\4\3\4\3\4\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\6\6\6\66\n"+
		"\6\r\6\16\6\67\3\6\3\6\3\7\6\7=\n\7\r\7\16\7>\3\b\3\b\3\b\3\b\3\25\2\t"+
		"\4\3\6\4\b\5\n\6\f\7\16\b\20\t\4\2\3\4\3\2\"\"\4\2C\\c|\2F\2\4\3\2\2\2"+
		"\2\6\3\2\2\2\3\b\3\2\2\2\3\n\3\2\2\2\3\f\3\2\2\2\3\16\3\2\2\2\3\20\3\2"+
		"\2\2\4\23\3\2\2\2\6%\3\2\2\2\b\'\3\2\2\2\n,\3\2\2\2\f\65\3\2\2\2\16<\3"+
		"\2\2\2\20@\3\2\2\2\22\24\13\2\2\2\23\22\3\2\2\2\24\25\3\2\2\2\25\26\3"+
		"\2\2\2\25\23\3\2\2\2\26\27\3\2\2\2\27\30\5\6\3\2\30\31\b\2\2\2\31\5\3"+
		"\2\2\2\32\33\7]\2\2\33\34\7T\2\2\34\35\7q\2\2\35&\7y\2\2\36\37\7]\2\2"+
		"\37 \7E\2\2 !\7q\2\2!\"\7n\2\2\"#\7w\2\2#$\7o\2\2$&\7p\2\2%\32\3\2\2\2"+
		"%\36\3\2\2\2&\7\3\2\2\2\'(\7]\2\2()\7T\2\2)*\7q\2\2*+\7y\2\2+\t\3\2\2"+
		"\2,-\7]\2\2-.\7E\2\2./\7q\2\2/\60\7n\2\2\60\61\7w\2\2\61\62\7o\2\2\62"+
		"\63\7p\2\2\63\13\3\2\2\2\64\66\t\2\2\2\65\64\3\2\2\2\66\67\3\2\2\2\67"+
		"\65\3\2\2\2\678\3\2\2\289\3\2\2\29:\b\6\3\2:\r\3\2\2\2;=\t\3\2\2<;\3\2"+
		"\2\2=>\3\2\2\2><\3\2\2\2>?\3\2\2\2?\17\3\2\2\2@A\7_\2\2AB\3\2\2\2BC\b"+
		"\b\4\2C\21\3\2\2\2\b\2\3\25%\67>\5\3\2\2\b\2\2\6\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}