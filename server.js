var options = require('./setting.json')
    //, exec = require('child_process').exec

var app = require('./demo/app.js')(options);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err,req,res,next){
        //console.log(err);
        //console.log(req.headers)
        res.status(err.status || 500);
        res.send(err.stack);
    })
}
app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.send(err.message);
})


var PORT = parseInt(process.env.PORT || 3001);
var server = app.listen(PORT, function () {
    console.log('Node app is running, port:', PORT);
});




