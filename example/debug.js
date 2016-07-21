define("debug", function(require, exports, module) {
    module.exports = function(str) {
        console.log(new Date() + "\n" + (str ? str : ""));
    }
});
