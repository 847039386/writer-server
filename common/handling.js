const strLength = (str ,max) => {
    if(str && str.length <= max){
        return str;
    }else if( str.length > max ){
        return str.substr(0,max)
    }else{
        return null;
    }
}


const arrPagination = (pageNo, pageSize, array) => {
    var offset = (pageNo - 1) * pageSize;
    return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
}


const timeAgo = (val) => {
    let nowDate = new Date();
    let replyDate = new Date(val);
    let diffSeconds = (nowDate.getTime()-Number(replyDate.getTime()))/1000;
    let years = 365*24*60*60;
    let months = 30*24*60*60;
    let days = 24*60*60;
    let hours =  60*60;
    let minutes = 60;
    let seconds = 1;
    if(diffSeconds<seconds){
        return '1秒以前'
    }else if(seconds<=diffSeconds&&diffSeconds<minutes){
        return Math.floor(diffSeconds/seconds)+'秒前'
    }else if(minutes<=diffSeconds&&diffSeconds<hours){
        return Math.floor(diffSeconds/minutes)+'分钟前'
    }else if(hours<diffSeconds&&diffSeconds<days){
        return Math.floor(diffSeconds/hours)+'小时前'
    }else if(days<diffSeconds&&diffSeconds<months){
        return Math.floor(diffSeconds/days)+'天前'
    }else if(months<diffSeconds&&diffSeconds<years){
        return Math.floor(diffSeconds/months)+'个月前'
    }else{
        return Math.floor(diffSeconds/years)+'年前'
    }
}

// 排序obj 降序
function compare(property){
    return function(obj1,obj2){
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value2 - value1;     
    }
}

module.exports = {
    strLength,
    arrPagination,
    timeAgo,
    compare
}