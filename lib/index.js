var postcss = require("postcss");

module.exports = postcss.plugin("postcss-pie", function(options) {
    "use strict";

    return function(css, result) {
        function testRemotesJs(url) {
            require("request")
                .get(url)
                .on("error", function(err) {
                    result.warn("options.pieLoadPath", err);
                });
        }
        if (options) {
            if (options.htcPath && options.htcPath[0] !== "/") {
                options.htcPath = null;
                result.warn("options.htcPath: the URL has to must be absolute from domain root");
            }

            if (options.pieLoadPath) {
                var pieLoadPath = options.pieLoadPath.replace(/\/?$/, "/PIE_IE");
                testRemotesJs(pieLoadPath + "678.js");
                testRemotesJs(pieLoadPath + "9.js");
            }
        }
        var opts = options || {};

        var hasBehavior;

        css.walkRules(function(rule) {

            var needBehavior;
            var hasGradient;
            /* If there are css rules that CSSPIE cannot access directly, loop through 
             * the existing ruleset and prefix them with "-pie"
             */
            rule.walkDecls(function(decl) {

                var needPrefix;

                if (/^background(?:-image)?$/.test(decl.prop) && /\bgradient\(/.test(decl.value)) {
                    // gradient background rule
                    hasGradient = true;
                    needPrefix = true;
                } else if (decl.prop === "background" &&
                                /\b(?:\/|text|contain|cover(?:(?:padding|border|content)-box))\b/
                                .test(decl.value.replace(/\burl\([^())]+\)/, ""))) {
                    // css3 styled background
                    needPrefix = true;
                } else if (/^background(?:-(?:color|image|repeat|attachment|position))?$/
                            .test(decl.prop) &&
                            /,/.test(decl.value)) {
                    // background styled with color|image|repeat|attachment|position
                    needPrefix = true;
                } else if (!needBehavior &&
                            /(?:border-image|border-radius|box-shadow|background-(?:size|origin|clip))/
                            .test(decl.prop)) {
                    // Other versions of PIE will process this, but IE8 cannot process
                    needBehavior = true;
                }

                if (needPrefix) {
                    needBehavior = true;
                    rule.insertBefore(decl, {
                        prop: "-pie-" + decl.prop,
                        value: decl.value,
                    });
                }
            });

            if (needBehavior && opts.htcPath) {
                hasBehavior = true;
                // If note of the background-gradient supplied, no behaviour poly needed
                if (!hasGradient && !rule.selectors.some(function(selector) {
                        return /^:root\b/.test(selector);
                    })) {
                    // IE9 requires special behavior property
                    rule.prepend({
                        prop: "behavior",
                        value: "none\\9\\0",
                    });
                }
                // Otherwise, specify behavior as htc
                rule.prepend({
                    prop: "behavior",
                    value: "url(\"" + opts.htcPath + "\")",
                });
            }
        });
        if (hasBehavior && opts.pieLoadPath) {
            css.prepend({
                selector: "html"
            });
            css.first.append({
                prop: "-pie-load-path",
                value: "\"" + opts.pieLoadPath + "\""
            });
        }
    };
});