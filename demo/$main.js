/**
 * Created by wangmin on 2015/6/7.
 */

var path =require('path')

function full(filename){
    return path.resolve(__dirname,filename);
}
exports = module.exports = tuple('_',function(_){
    _ = _||require('underscore')
    return [
        tuple('main',function(req,res,next){
            res.json({a:'main'})
        })
    ];
});