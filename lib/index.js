/**
 * Created by wangmin on 15/6/29.
 */

var path = require('path')
    ,util = require('util')
    , coreExtend=require('./core-extend');
function full(filename){
    return path.resolve(__dirname,filename);
}
exports.treeRouter=  include(full('./tree-router'));
exports.requireConfig=  function(extend){
    Object.defineProperty(this, "extend", {
        get: function () { return extend; }
    });
    return this;
}
