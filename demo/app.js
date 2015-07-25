var path = require('path')
    , express =require('express')
    ,servestatic   = require('serve-static')
    ,favicon = require('serve-favicon')
    , util =require('util')
    ,IncomingMessage =  require('http').IncomingMessage
    ,formidable = require('formidable')
    //,logger=require('./lib/logger')
    ,mauk=require('../lib')


var extend= {
    viewEngine: require('ejs'),
    //_: require('underscore'),
    //Promise: require('q'),
    //log: logger
}



IncomingMessage.prototype.isAuthorized = function() {
    //can be override isAuthorized
    return true;
}

IncomingMessage.prototype.waitPost = function(fn) {
    //can be override
    var req =this;
    if (req.method !== 'POST') return fn();

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        util._extend(req.query, fields);
        fn(err);
    })
}



exports=module.exports=function(options) {
    var app= express({strict: true});
    mauk.requireConfig.call(app,extend);
    var tree=  mauk.treeRouter(app)();
    tree.load(__dirname);
    app.use(servestatic('public', {redirect: false}))
        .use(favicon('./demo/favicon.ico'))
        .use(tree.route())
    return app;
}






