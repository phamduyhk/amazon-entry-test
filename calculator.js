var checkDigit = function(str){
    if(!str){
        return false;
    }
    var posiableDigit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/','(',')'];
    for (var i = 0; i < str.length; i++) {
        if (!posiableDigit.includes(str[i])){
            return false;
        }
    }
    return true;
}
function calc(fn) {
    return new Function('return ' + fn)();
}


module.exports = {
    calc: function(fn){
        if(checkDigit(fn)){
            return new Function('return ' + fn)()+'';
        }
        return 'ERROR';
    }
}