/**
 * Created by wangmin on 15/6/29.
 */



var IncomingMessage =  require('http').IncomingMessage
//,OutgoingMessage=  require('http').OutgoingMessage
    ,ServerResponse = require('http').ServerResponse
    ,util=require('util')


global.tuple = require('./tuple')
global.include = require('./include-extend')


IncomingMessage.prototype.isAuthorized = function() {
    //var self = this;
    console.log('isAuthorized is not complete!!');
    return true;
}
ServerResponse.prototype.success=function(value){
    var self = this;
    self.json(util._extend({reuslt:'success'},value))
}
ServerResponse.prototype.fail=function(value){
    var self = this;
    self.json(util._extend({reuslt:'fail'},value))
}

ServerResponse.prototype.render2 = function(options){
    var self =  this;
    if (!self.$view) return ; //about '$view',please read tree-router.js
    self.contentType('html');
    self.send(self.$view(options||{}));
}






