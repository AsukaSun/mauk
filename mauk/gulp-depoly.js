/**
 * Created by wangmin on 2015/6/18.
 */
var gulp = require('gulp'),
    rename = require('gulp-rename')
    ,path = require("path")
    ,fs = require('fs')
exports=module.exports=function (source,target,current) {
    if (!fs.statSync(source).isDirectory()) {
        return;
    }
    function searchfiles(sourcePath, dirList) {
        var fileList = [];
        dirList.forEach(function (item) {
            if (fs.statSync(path.join(sourcePath, item)).isFile()) {
                var src = path.join(sourcePath, item);
                var newName = item.replace(/^\!/i, '');
                var targetPath = path.join(target, path.relative(source, sourcePath));
                if ((/^\!/i).test(item)) {
                    fileList.push({src: src, target: targetPath, name: newName});
                }
            }
        });
        return fileList;
    }

    function targetOut(name, fileList) {
        gulp.task(name, function () {
            fileList.forEach(function (item) {
                gulp.src(item.src)
                    .pipe(rename(item.name))
                    .pipe(gulp.dest(item.target))
            })
        });
    }

    var fileList = [];

    function walk(sourcePath, deepth) {
        if (deepth <= 0) return;
        var dirList = fs.readdirSync(sourcePath);
        fileList = fileList.concat(searchfiles(sourcePath, dirList));
        !current && dirList.forEach(function (item) {
            if (fs.statSync(path.join(sourcePath, item)).isDirectory() && (item !=='!public')) {
                walk(path.join(sourcePath, item), deepth - 1);
            }
        });
    }

    walk(source, 99);
    fileList.forEach(function (item) {
        gulp.src(item.src)
            .pipe(rename(item.name))
            .pipe(gulp.dest(item.target))
    })
}
