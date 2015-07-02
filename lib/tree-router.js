/**
 * Created by wangmin on 15/6/17.
 */

var fs = require('fs')
    ,path = require('path')
    ,hash=require('./hash')
    ,Router=require('express').Router

function isFunction(fn){
    return typeof (fn)==='function'
}


exports = module.exports = tuple('log!mauk','viewEngine',function(log,viewEngine) {
        var app = this;
        function createLeaf(option, fn) {
            var option = option;
            isFunction(option) && (fn = option, option = fn.name);
            if (!isFunction(fn)) return;
            var opttype= Object.prototype.toString.call(option);
            option= opttype=== "[object RegExp]" || opttype=== "[object String]"?{rule:option}:option
            option.rule||(option.rule=fn.name);
            fn.rule = option.rule;
            fn.method = option.method || '*';
            if (typeof (fn.rule) === 'string') {
                fn.rule = new RegExp(fn.rule, 'i');
                fn.hashed = false;
            }
            option.noAuth&&(fn.noAuth = option.noAuth);
            option.view && viewEngine && parseTpl.call(null, option, fn);
            option.waitPost&&(fn.waitPost = option.waitPost);
            if (!fn.rule) return;
            return fn;
        };

        function parseTpl(option, fn) {
            var template = fs.readFileSync(option.view).toString();
            fn.view = viewEngine.compile(template);
        }

        function findRouteFiles(dir) {
            var fileList = [];
            function walk(targetPath, deepth) {
                if (deepth <= 0) return;
                var dirList = fs.readdirSync(targetPath);
                dirList.forEach(function (item) {
                    var fullpath = path.join(targetPath, item);
                    if (fs.statSync(fullpath).isFile()) {
                        (/^\$/).test(item) && fileList.push(fullpath)
                    }
                });
                dirList.forEach(function (item) {
                    var fullpath = path.join(targetPath, item);
                    if (fs.statSync(fullpath).isDirectory()) {
                        walk(fullpath, deepth - 1);
                    }
                })
            }

            walk(dir, 4);
            return fileList;
        }

        function createLeaves(leaves) {
            var newLeaves = [];
            leaves && leaves.forEach(function (fn) {
                var fn = fn;
                var leaf = isFunction(fn) ? createLeaf.call(null, fn) : createLeaf.apply(null, fn)
                leaf && newLeaves.push(leaf);
            });
            return newLeaves;
        }

        function emptyNode() {
            return {'$$': []};
        }

        function router() {
            this.root = emptyNode();
            this.hashUrls = {};
        }


        router.prototype.load = function (dir, basePath) {
            var self = this;
            var basePath = typeof (basePath) === 'string' ? basePath.split(path.sep) : [];
            var start = self.root;
            basePath.forEach(function (item) {
                if (!item || typeof(item) !== 'string') return;
                var item = item.toUpperCase();
                start = start[item] ? start[item] : (start[item] = emptyNode())
            });
            findRouteFiles.call(self, dir).forEach(function (item) {
                try {
                    var branchs = path.relative(dir, item).split(path.sep).slice(0, -1);
                    var parent = start;
                    branchs.forEach(function (branch) {
                        var branch = branch.toUpperCase();
                        parent = parent[branch] || (parent[branch] = emptyNode());
                    });
                    parent['$$'] = createLeaves.call(self, include(item)(app));
                } catch (e) {
                    console.log(e);
                }
            })
        }

        router.prototype.use = function () {
            var self = this;
            var rt = Router({strict: true});
            rt.use(function (req, res, next) {
                var hashUrl = hash(req._parsedUrl.pathname);
                var doFn = self.hashUrls[hashUrl];
                if (!doFn) {
                    var branchs = req._parsedUrl.pathname.replace(/^\//, '').split('/');
                    var start = self.root;
                    var i = 0;
                    for (var n = branchs.length; i < n; i++) {
                        var branch = start[branchs[i].toUpperCase()];
                        if (!branch) break;
                        start = branch;
                    }
                    var leaf = branchs.slice(i).join('/');
                    //console.log(leaf);
                    var fns = start['$$'] || [];
                    i = 0;
                    for (var n = fns.length; i < n; i++) {
                        var fn = fns[i];
                        if (fn.rule && fn.rule.test(leaf)) {
                            if (fn.hashed === false) {
                                fn.hashed = true
                                self.hashUrls[hashUrl] = fn;
                            }
                            doFn = fn;
                            break;
                        }
                    }
                }

                if ( doFn && !doFn.noAuth && !req.isAuthorized()){
                    var err = new Error('This user is not authorized!!----'+__filename)
                    err.status = 500;
                    next(err);
                }else{
                    if (doFn && (doFn.method === '*' || doFn.method === req.method)) {
                        req.waitPost && (!doFn.waitPost) && req.waitPost.call(req,function(err){
                            if (err)  return  next(err);
                            doFn.view && (res.$view = doFn.view)
                            doFn.call(app, req, res, next)

                        });

                    } else {
                        next();
                    }
                }

            })
            return rt;
        }
        return function () {
            return new router();
        }
        //return router;

    })


