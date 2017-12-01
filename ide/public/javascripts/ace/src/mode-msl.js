define("ace/mode/msl_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";

    const oop = require("../lib/oop");
    const TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    const MslHighlightRules = function() {
        // taken from http://download.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
        const keywords = (
            "if|then|else|end|def|global|each|chance|function|return|terminate|clock|$index|$element"
        );

        const buildinConstants = ("null");

        const buildInMethods = (
            "List|randomize|rotate|get|has|indexOf|add|addFirst|addLast|addAllFirst|addAllLast|" +
            "set|addAt|removeFirst|removeLast|remove|removeAt|clear|select|rank|print|and|or|->"
        );

        const keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": buildinConstants,
            "support.function": buildInMethods
        }, "identifier");

        const StringRule = {
            token: "string",           // " string
            regex: '".*?"'
        };

        //in tag
        const EqualSignRule = {
            //use another class name
            token: "gray",
            regex: /=/
        };

        const BooleanRule = {
            token : "constant.language.boolean",
            regex : "(?:true|false)\\b"
        };

        const KeyWordMapperRule = {
            token : keywordMapper,
            regex : "[a-zA-Z$][a-zA-Z0-9]*\\b"
        };

        const QuestionStartRule = {
            token: "question",
                regex: /\[SingleChoice|\[SingleMatrix|\[MultipleChoice|\[MultipleMatrix/,
            next: "inQuestionTag"
        };

        this.$rules = {
            "start" : [ {
                token: "gray",
                regex: /\[PageGroupEnd]/
            }, {
                token: "gray",
                regex: /\[PageGroup/,
                next: "inPageGroupTag"
            }, {
                //here, maybe change the class name
                token: "gray",
                regex: /\[Page/,
                next: "inPageTag"
            }],

            "inPageGroupTag": [StringRule, EqualSignRule, {
                //use another class name
                token: "gray",
                regex: /]/,
                next: "inPrePageScript"
            }],

            "inPrePageScript": [StringRule, BooleanRule, KeyWordMapperRule, {
                token: "keyword",
                regex: /\[Page/,
                next: "inPageTag"
            }],

            "inPageTag": [StringRule, EqualSignRule, {
                //use another class name
                token: "gray",
                regex: /]/,
                next: "inPreQuestionScript"
            }],

            "inPreQuestionScript": [StringRule, BooleanRule, KeyWordMapperRule, QuestionStartRule],

            "inQuestionTag": [StringRule, EqualSignRule, {
                token: "question",
                regex: /]/,
                next: "inQuestionBody"
            }],

            "inQuestionBody": [{
                token: "question_row",
                regex: /\[Row/,
                next: "inRowTag"
            }, {
                token: "question_col",
                regex: /\[Col/,
                next: "inColTag"
            }, {
                token: "submit",
                regex: /\[Submit]/,
                next: "inPostQuestionScript"
            }, QuestionStartRule],

            "inPostQuestionScript": [StringRule, BooleanRule, KeyWordMapperRule, {
                token: "gray",
                regex: /\[PageEnd]/,
                next: "start"
            }],

            "inRowTag": [StringRule, EqualSignRule, {
                //use another class name
                token: "question_row",
                regex: /]/,
                next: "inQuestionBody"
            }],

            "inColTag": [StringRule, EqualSignRule, {
                //use another class name
                token: "question_col",
                regex: /]/,
                next: "inQuestionBody"
            }]

        };
        this.normalizeRules();
    };

    oop.inherits(MslHighlightRules, TextHighlightRules);

    exports.MslHighlightRules = MslHighlightRules;
});

define("ace/mode/msl",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/msl_highlight_rules"], function(require, exports, module) {
    "use strict";

    const oop = require("../lib/oop");
    const TextMode = require("./text").Mode;
    const MslHighlightRules = require("./msl_highlight_rules").MslHighlightRules;

    const Mode = function() {
        this.HighlightRules = MslHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {

        this.lineCommentStart = "--";

        this.$id = "ace/mode/msl";
    }).call(Mode.prototype);

    exports.Mode = Mode;

});
