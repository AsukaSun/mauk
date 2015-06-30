var path = require('path')
    , express =require('express')
    ,servestatic   = require('serve-static')
    ,favicon = require('serve-favicon')
    ,mauk=require('../mauk')



function full(filename){
    return path.resolve(__dirname,filename);
}

function createApplication(options){
    var logger=mauk.logger;
    logger.initialize(options.log);
    var app= express();
    var depends = {};
    depends.viewEngine = require('ejs')
    depends._ = require('underscore')
    depends.Promise = require('q')
    depends.log= logger;
    app.getLog=function(){
        return logger.apply(null,arguments)
    };
    Object.defineProperty(app, "extend", {
        get: function () { return depends; }
    });
    return app;
}

exports=module.exports=function(options) {
    var app=createApplication(options)
    var tree=  mauk.treeRouter(app)();
    tree.load(path.resolve('app'));
    var passes= include(full('./~lib/passes'))(app);
    app.use(servestatic('public', {redirect: false}))
        .use(favicon('app/favicon.ico'))
        //.use(app._logger.use())
        .use(passes.someValid)
        .use(tree.use())
    //app.enable('trust proxy');
    //app.use(AV.Cloud.HttpsRedirect());
    return app;
}

