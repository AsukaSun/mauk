/**
 * Created by wangmin on 15/6/29.
 */

var path = require('path')
function full(filename){
    return path.resolve(__dirname,filename);
}
var coreExtend=require('./core-extend');
exports.treeRouter=  include(full('./tree-router'));
exports.logger=require('./logger');

//include(full('./~lib/passes'))(app);