/**
 * Created by wangmin on 15/6/26.
 */


var path = require('path')
    ,IncomingMessage =  require('http').IncomingMessage


exports = module.exports = tuple('log','AV','_',function(log,AV,_) {
    var app = this;
    var funSet = {};
    [
        function requestPhoneVerify(req, res, next) {
            //console.log('passes......');
            next();

        }
    ].forEach(function (fn) {
            funSet[fn.name] = fn;
        })
    return funSet;
});