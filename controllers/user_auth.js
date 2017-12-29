const UserAuth = require('../proxy').UserAuth;

const hostLogin = async ( ctx , next ) => {
    let uname = ctx.request.body.uname;
    let pass = ctx.request.body.pass;
    let result = { success :false }
    if(uname && pass){
        result = await UserAuth.hostLogin(uname ,pass)
    }else{
        result = Object.assign(result ,{ msg : '参数不符合规则'})
    }
    ctx.body = result;
}

const hostRegister = async ( ctx , next ) => {
    let result = { success :false }
    let name = ctx.request.body.name;
    let uname = ctx.request.body.uname;
    let pass = ctx.request.body.pass;
    if(uname && pass){
        result = await UserAuth.toRegister('username',name,uname,'http://www.qqw21.com/article/UploadPic/2012-9/20129184657343.jpg',pass);
    }else{
        result = Object.assign(result,{ msg : '参数不符合规则'})
    }
    ctx.body = result;
} 

const findRepeatUName = async ( ctx ,next ) => {
    let result  = { success : false }
    let uname = ctx.query.uname;
    if(!uname){
        result = Object.assign(result,{msg :'参数不合规则'})
    }else{
        result = await UserAuth.findRepeatUName(uname)
    }
    ctx.body = result;
    
}

const qqLogin = async (ctx ,next) => {
    let result = { success :false }
    let code = ctx.query.code;
    if(code){
        result = await UserAuth.qqLogin(code);
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

module.exports = {
    hostLogin,
    hostRegister,
    findRepeatUName,
    qqLogin
}