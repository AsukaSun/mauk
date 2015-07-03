/**
 * Created by wangmin on 15/7/3.
 */

var logfn=function(){
    console.log.apply(null,arguments);
}

exports = module.exports = function () {
    logfn.log =console.log
    logfn.warn =console.warn
    logfn.error =console.error
    logfn.info =console.info
    return logfn;
}
