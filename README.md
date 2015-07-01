# mauk
this is a web frame base on express
# clone
npm install mauk
# demo

```javascript

var extend= {
    viewEngine: require('ejs'),
    _: require('underscore'),
    Promise: require('q'),
    log: logger
}
    mauk.requireConfig.call(app,extend);
    var tree=  mauk.treeRouter(app)();
    tree.load(__dirname);
    app.use(tree.use())

```

```javascript
exports = module.exports = tuple('log!access','_',function (log,_){
    var app = this;
    return [
        function notuple(req, res) {
            res.success({haha:'notuple'})
        },
        tuple(function simple(req,res){
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

```

first character  !  file ,it is web file ,and deployed by gulp

http://localhost:3001/demo/simple?d=3
http://localhost:3001/demo/notuple?d=3
http://localhost:3001/demo/noname?d=3
http://localhost:3001/demo/hello
http://localhost:3001/demo/rule
http://localhost:3001/demo/article
http://localhost:3001/demo/say
http://localhost:3001/demo/doFail
http://localhost:3001/main

