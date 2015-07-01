/**
 * Created by wangmin on 15/6/16.
 */
var log4js = require('log4js');

exports = module.exports = function (name) {
    var logger = log4js.getLogger(name || 'normal');
    //logger.setLevel('INFO');
    return logger;
}

exports.use = function () {
    return log4js.connectLogger(log4js.getLogger('access'),{level:'trace',format:':method :url :status'});
}

/*
Object.defineProperty(exports, "use", {
    get: function () {
        return log4js.connectLogger(log4js.getLogger('access'),{level:'trace',format:':method :url :status'});
    }
});*/


exports.initialize = function (options) {
    options&& log4js.configure({appenders: options, replaceConsole: false});
}
