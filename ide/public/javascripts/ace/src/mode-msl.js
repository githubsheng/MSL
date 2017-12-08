define("ace/mode/msl_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
    "use strict";

    const oop = require("../lib/oop");
    const TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    const MslHighlightRules = function () {
        const keywords = "if|then|else|end|def|global|each|chance|function|return|terminate|clock|$index|$element|and|or";

        const buildinConstants = "null";

        const buildInMethods = (
            "List|randomize|rotate|get|has|indexOf|add|addFirst|addLast|addAllFirst|addAllLast|" +
            "set|addAt|removeFirst|removeLast|remove|removeAt|clear|select|rank|print|->"
        );

        const buildInProperties = "selected|duration|answeredWhen|";

        const keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": buildinConstants,
            "purple": buildInMethods
        }, "identifier");

        const StringRule = {
            token: "string",           // " string
            regex: '".*?"'
        };

        //in tag
        const EqualSignRule = {
            token: "gray",
            regex: /=/
        };

        const BooleanRule = {
            token: "constant.language.boolean",
            regex: "(?:true|false)\\b"
        };

        const DotRule = {
            //wow, this is incredibly useful
            //see https://stackoverflow.com/questions/25213824/ace-editor-non-capturing-group-issue
            token: ["text", "purple"],
            regex: /(\.)(selected|duration|displayedWhen|answeredWhen|totalClicks|geoLocation)/
        };

        const KeyWordMapperRule = {
            token: keywordMapper,
            regex: "[a-zA-Z$][a-zA-Z0-9]*\\b"
        };

        const QuestionStartRule = {
            token: "question",
            regex: /\[SingleChoice|\[SingleMatrix|\[MultipleChoice|\[MultipleMatrix/,
            next: "inQuestionTag"
        };

        const PageAndPageGroupStartRules = [{
            token: "gray",
            regex: /\[PageGroupEnd]/
        }, {
            token: "gray",
            regex: /\[PageGroup/,
            next: "inPageGroupTag"
        }, {
            token: "gray",
            regex: /\[Page/,
            next: "inPageTag"
        }];

        const startRules = [{
            token: "keyword",
            regex: /(?:JS|CSS)/
        }, StringRule, ...PageAndPageGroupStartRules];

        const submitButtonRule = {
            token: "submit",
            regex: /\[Submit]/,
            next: "inPostQuestionScript"
        };

        const PageEndRule = {
            token: "gray",
            regex: /\[PageEnd]/,
            next: "pageAndPageGroupStart"
        };

        this.$rules = {
            "start": startRules,

            "pageAndPageGroupStart": PageAndPageGroupStartRules,

            "inPageGroupTag": [StringRule, EqualSignRule, {
                token: "gray",
                regex: /]/,
                next: "inPrePageScript"
            }],

            "inPrePageScript": [StringRule, BooleanRule, DotRule, KeyWordMapperRule, {
                token: "gray",
                regex: /\[Page/,
                next: "inPageTag"
            }],

            "inPageTag": [StringRule, EqualSignRule, {
                token: "gray",
                regex: /]/,
                next: "inPreQuestionScript"
            }],

            "inPreQuestionScript": [
                StringRule,
                BooleanRule,
                DotRule,
                KeyWordMapperRule,
                QuestionStartRule,
                /*
                 submit button is not supposed to show in pre question script, however, we add this highlight rule here
                 because we normally type:
                 [Page]
                 [Submit]
                 [PageEnd]
                 and then immediately add questions between [Page] and [Submit]
                 because this happens very often we want the syntax highlight to highlight the submit button as well.

                 same for pattern
                 [Page]
                 [PageEnd]
                 */
                submitButtonRule,
                PageEndRule
            ],

            "inQuestionTag": [StringRule, EqualSignRule, {
                token: "question",
                regex: /]/,
                next: "inQuestionBody"
            }
            ],

            "inQuestionBody": [{
                token: "question_row",
                regex: /\[Row/,
                next: "inRowTag"
            }, {
                token: "question_col",
                regex: /\[Col/,
                next: "inColTag"
            }, QuestionStartRule,
                /*
                 * we often type
                 * [Page]
                 * [PageEnd]
                 *
                 * and then we start to insert questions, so at certain time we will have
                 * [Page]
                 * [SingleChoice]
                 * [PageEnd]
                 *
                 * and then we continue to add rows and columns
                 * this happens so often, therefore we want the syntax highlight to highlight page end / submit button in this case...
                 */
                submitButtonRule,
                PageEndRule],

            "inPostQuestionScript": [StringRule, BooleanRule, DotRule, KeyWordMapperRule, PageEndRule],

            "inRowTag": [StringRule, EqualSignRule, {
                token: "question_row",
                regex: /]/,
                next: "inQuestionBody"
            }],

            "inColTag": [StringRule, EqualSignRule, {
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

define("ace/mode/msl", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/msl_highlight_rules"], function (require, exports, module) {
    "use strict";

    const oop = require("../lib/oop");
    const TextMode = require("./text").Mode;
    const MslHighlightRules = require("./msl_highlight_rules").MslHighlightRules;

    const Mode = function () {
        this.HighlightRules = MslHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function () {

        this.lineCommentStart = "--";

        this.$id = "ace/mode/msl";
    }).call(Mode.prototype);

    exports.Mode = Mode;

});
