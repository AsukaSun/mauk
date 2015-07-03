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
#介绍
   这个是基于EXPRESS的，根据文件夹进行路由的WEB框架，解决了原来项目中路由与文件分布使用困难的问题，使用动态路由以后代码的耦合性大大降低；
   前端代码JS于后端代码JS根据逻辑需要分布在同一文件夹，根据逻辑要求拉近了前后端代码的空间；
   !开头的文件提供给前端WEB使用，通过GULP或者其他工具自动发布到对应的PUBLIC文件夹中；
   $开头文件提供给后端使用，动态加载到路由树中
   此框架特别适合中小型应用的快速开发和部署,逻辑清晰，代码简单
# 加入
欢迎大家加入  nodejs & mauk技术交流群，一起共同成长！QQ群号： 231138315  (^_-)-☆


```

http://localhost:3001/demo/simple?d=3
http://localhost:3001/demo/notuple?d=3
http://localhost:3001/demo/noname?d=3
http://localhost:3001/demo/hello
http://localhost:3001/demo/rule
http://localhost:3001/demo/article
http://localhost:3001/demo/say
http://localhost:3001/demo/doFail
http://localhost:3001/main

```


