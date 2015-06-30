

var gulp = require('gulp')
    ,path = require("path")
    ,deploy= require( "./mauk/gulp-depoly")

gulp.task('app' ,function( ) {
    var soucrce=path.resolve('app')
    var target=path.resolve('public')
    deploy(soucrce,target);
});

gulp.task('public' ,function( ) {
    var soucrce=path.resolve('app/!public')
    var target=path.resolve('public')
    deploy(soucrce,target);
});

gulp.task('static',function(){
    gulp.src('vendor/jquery/dist/jquery.js')
        .pipe(gulp.dest('public/public'))
    console.log('this is the static task');

});

gulp.task('all', ['static','public','app'] ,function( ) {
    console.log('this is the clean task');
});

gulp.task('default', function() {
    //gulp.start('all');
    //gulp.start('static');


    //var soucrce=path.resolve('app')
    //var target=path.resolve('public')
    //deploy(soucrce,target);
});