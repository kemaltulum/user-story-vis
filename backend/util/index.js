function typeOfUtil(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

function findChar(text, char, which=1){
    var len = text.length;

    for(var i=0; i<len; i++){
        if(text[i] === char){
            if(which === 1){
                return i;
            } else{
                which -= 1;
            }
        }
    }

    return false;
}

module.exports = {
    typeOfUtil : typeOfUtil,
    findChar: findChar
}