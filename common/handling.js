const strLength = (str ,max) => {
    if(str && str.length <= max){
        return str;
    }else if( str.length > max ){
        return str.substr(0,max)
    }else{
        return null;
    }
}

exports.strLength = strLength;