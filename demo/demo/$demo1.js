/**
 * Created by wangmin on 15/6/16.
 */

var path = require('path')

function full(filename){
    return path.resolve(__dirname,filename);
}

exports = module.exports = tuple('log!access','_',function (log,_){
    var app = this;
    return [
        function notuple(req, res) {
            res.success({haha:'notuple'})
        },
        tuple(function simple(req,res){
            log.error('log.error(str)');
            log.info('log.info(str)');
            log.warn('log.warn(str)');
            res.success({haha:'simple'})
        }),
        tuple('noname',function(req,res,next){
            res.json({a:'noname'})
        }),
        tuple(/rule/i,function(req,res,next){
            res.success({haha:'rule'})
        }),

        tuple({noAuth:true},function hello(req,res,next){
            res.success({haha:'hello'})
        }),

        tuple({rule:'article',method:'GET',view:full('demo1.ejs'),noAuth:true},function(req,res,next){
            res.render2({currentTime:678});
            //res.json({a:2})
        }),
        tuple({rule:/say/i,method:'GET',noAuth:true},function(req,res,next){
            res.success({haha:'ok'})
        }),
        tuple({rule:'doFail',method:'GET',noAuth:true},function(req,res,next){
            res.fail({haha:'err'})
        })


    ];
});
