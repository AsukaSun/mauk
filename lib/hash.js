/**
 * Created by wangmin on 15/6/18.
 */

var I64BIT_TABLE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'.split('');
exports = module.exports = function (str, caseSensitive) {
    var hash = 5381
        , i = str.length
        , ch;
    while (i) {
        ch = str.charCodeAt(--i);
        !caseSensitive && ch >= 97 && ch <= 122 && (ch -= 32 );
        hash = (hash * 33) ^ ch;
    }
    //return hash >>> 0;
    hash = hash & 0x7FFFFFFF
    var value = '';
    do {
        value += I64BIT_TABLE[hash & 0x3F];
    }
    while (hash >>= 6);

    return value;

}