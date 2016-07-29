define('error', function(require, exports, module) {
    module.exports = function(str) {
        return "==error==\n" + (str ? str : "");
    }
});

define('warn', function(require, exports, module) {
    module.exports = function(str) {
        return "==warn==\n" + (str ? str : "");
    }
});
