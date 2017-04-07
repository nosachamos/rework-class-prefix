'use strict';

var isPresent = require('is-present');
var hasClassSelector = require('has-class-selector');

module.exports = function classPrefix(prefix, options) {
    options = options || {};
    var ignored = options.ignored;

    return function prefixRules(styling) {
        styling.rules.forEach(function(rule) {

            if (rule.rules) {
                return prefixRules(rule);
            }

            if (!rule.selectors) return rule;

            rule.selectors = rule.selectors.map(function(selector) {

                if (hasClassSelector(selector)) {
                    // Ensure that the selector doesn't match the ignored list

                    return selector.split('.')
                        .map(function(s, index) {
                            let shouldIgnore = false;
                            if (isPresent(ignored)) {
                                shouldIgnore = index === 0 && s !== '' || s === '' || ignored.some(function(opt) {

                                        if (typeof opt == 'string') {
                                            if (s.indexOf(' ') > 0) {
                                                return '.' + s.substring(0, s.indexOf(' ')) === opt;
                                            } else {
                                                return '.' + s === opt;
                                            }
                                        } else if (opt instanceof RegExp) {
                                            if (s.indexOf(' ') > 0) {
                                                return opt.exec('.' + s.substring(0, s.indexOf(' ')));
                                            } else {
                                                return opt.exec('.' + s);
                                            }
                                        }
                                    });
                            }

                            return shouldIgnore ? s : prefix + s;
                        })
                        .join('.');

                } else {
                    return selector;
                }
            });
        });
    };
};
