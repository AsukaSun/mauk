/**
 * Created by wangmin on 15/6/20.
 */



var path = require('path')



exports = module.exports = tuple('AV','_',function(AV,_) {
    var app = this;
    var funSet = {};
    [
        function someValid(req, res, next) {
            //console.log('passes......');
            next();

        }
    ].forEach(function (fn) {
            funSet[fn.name] = fn;
        })
    return funSet;
});