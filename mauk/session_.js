/**
 * Created by Administrator on 2015/6/21.
 * not complete
 */
var util=require('util')
    ,parse = require('cookie-parser')
    ,Cookie = require('session.js')
    , Q = require("q")
    ,uid = require('uid-safe').sync
    ,signature = require('cookie-signature')
    ,Cookies = require('cookies');


exports=module.exports=function(options){
    options=options||{};
    options.secret=options.secret||'wangmin';
    options.maxAge=options.maxAge||7 * 24 * 60 * 60 * 1000;
    var keys = [options.secret];

    return function(req, res, next){
        var cookies = new Cookies(req, res, keys);
    }
}


var defaultOptions ={
    secret:'wangmin' ,
    sidkey:'connect.sid',
    fieldkey:'session',
    fielduser:'user',
    EXPIRES:7* 24 * 60* 60 * 1000,
    PREFIX:'sess:',
    PREFIX_AUTH:'auth:',
    ONEDAY: 24 * 60* 60,
    store:undefined //fn
};
exports=module.exports=function(options){
    defaultOptions= util._extend(defaultOptions,options);
    var Store=options.store;
    function Session(req,res,options_){
        this.id=undefined;
        this.cookies=undefined;
        this.user=undefined;
        var cip=req.headers['x-forwarded-for'] || req.connection.remoteAddress
            || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        Object.defineProperty(this, 'req', { value: req });
        Object.defineProperty(this, 'res', { value: res });
        Object.defineProperty(this, 'options', { value: options_ });
        Object.defineProperty(this, 'clientIP', { value: cip });
    }

    Session.prototype.bind = function(){
        this.req.session=this;
        this.req.sessionID=this.id;
    }

    Session.prototype.storeKey=function() {
       return this.options.PREFIX+this.id;
    }



    var secretParse= parse( options.secret,options);
    var fnEmpty=function(){};

    Session.prototype.newSession=function() {
        var self=this;
        var cookies=new Cookie();
        cookies.maxAge=self.options.EXPIRES||defaultOptions.EXPIRES;
        self.id=uid(24);
        self.cookies=cookies;
        self.user=undefined;
        self.bind();
    }

    Session.prototype.save=function(){
        var self=this;
        if (!self.user||!self.user['USER_ID']) return Q();
        var user=self.user;
        self.newSession();
        self.user=user;
        var store=Store(self,{x:user['USER_ID']});
        function completeStore(){
            var writeHead = self.res.writeHead;
            self.res.writeHead = function () {
                var signed = 's:' + signature.sign(self.id, self.options['secret']);
                var data = self.cookies.serialize(self.options['sidkey'], signed);
                var prev = self.res.getHeader('set-cookie') || [];
                var header = Array.isArray(prev) ? prev.concat(data)
                    : Array.isArray(data) ? [prev].concat(data)
                    : [prev, data];
                header=header.concat(self.cookies.serialize('USER_ID', user.USER_ID))
                self.res.setHeader('set-cookie', header)
                self.res.writeHead = writeHead;
                writeHead.apply(this, arguments);
            };
        }
        return  store.save().then(completeStore);
    }

    function dispatchSession(req,res,options) {
        var sess= new Session(req,res,options);
        //for test
        //sess.user={USER_ID:22333,USER_NAME:'zdfd'}
        //return sess.save();
        req.cookies||secretParse(req,res,fnEmpty);
        var userId=req.cookies.USER_ID;
        delete req.cookies.USER_ID;
        if (!req.signedCookies[options.sidkey]||!userId){
            sess.newSession();
            return   Q();
        }
        sess.id=req.signedCookies[options.sidkey];
        var store=Store(sess,{x:userId});
        function parseStore(data){
            var jcookies=data[options['fieldkey']]
            var juser=data[options['fielduser']];
            try {
                if (!(jcookies&&juser&&(jcookies= JSON.parse(jcookies))&&(juser = JSON.parse(juser))
                    &&userId===juser['USER_ID'])){
                    return sess.newSession();
                }
                var expires=new Date(jcookies.expires);
                if ( expires.getTime()<Date.now())  return sess.newSession();
                var cookies=new Cookie();
                cookies.expires= new Date(jcookies.expires);
                var user={};
                juser.USER_ID&&(user.USER_ID=juser.USER_ID);
                juser.USER_NO&&(user.USER_NO=juser.USER_NO);
                juser.USER_NAME&&(user.USER_NAME=juser.USER_NAME);
                juser.USER_PWD&&(user.USER_PWD=juser.USER_PWD);
                sess.user= juser.USER_ID? user:undefined;
                sess.cookies=cookies;
                sess.bind();
            }catch(err){
                return sess.newSession();
            }
        }
        return  store.load().then(parseStore);
    }


    return function (req,res,next){
        if (req.session) return next();
        var options= util._extend({},defaultOptions);
        options.secret=options.secret || req.secret;
        dispatchSession(req,res,options).then(next).fail(next);
    }
}
