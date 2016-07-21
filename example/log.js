define("log", function(require, exports, module) {
    var error = require('error');
    var warn = require('warn');
    var debug = require('debug');

    exports.warn = function(str) {
        debug();
        console.log(warn(str));
    };
    exports.err = exports.error = function(str) {
        modulejs('debug', function(debug) {
            debug();
            console.log(error(str));
        })
    };
    exports.debug = function(str) {
        debug(str);
    };
});
