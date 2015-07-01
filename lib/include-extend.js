/**
 * Created by wangmin on 15/6/19.
 */

exports=module.exports=function(fullFile){
    var defines=require(fullFile); //tuple
    var pn=defines.length;
    if (pn<=0 || typeof (defines[pn-1] )!=='function') return ;
    var fn = defines[pn-1] ;
    return function(app){
        var args=[];
        for (var i= 0,n=pn- 2;i<=n;i++){
            var varName=defines[i];
            var varLog=  (/^(log)(|!([\s\S]*))$/i).exec(varName);
            var varValue=app.extend[varName];
            if (varLog){
                var func=app.extend[varLog[1]];
                varValue= typeof(func)==='function'? (varLog[3]):undefined;
            }
            args.push(varValue);
        }
        return fn.apply(app,args);
    };
}
