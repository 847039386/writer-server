const UserAuth = require('../proxy').UserAuth;
const Conf = require('../config')

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
        let ri = Math.floor(Math.random()*16 + 1);
        result = await UserAuth.toRegister('username',name,uname,`/images/avatar/${ri}.png`,pass);
    }else{
        result = Object.assign(result,{ msg : '参数不符合规则'})
    }
    ctx.body = result;
} 

const findRepeatUIdentifier = async ( ctx ,next ) => {
    let result  = { success : false }
    let identifier = ctx.request.body.identifier;
    let identity_type = ctx.request.body.identity_type;
    if(!identifier || !identity_type){
        result = Object.assign(result,{msg :'参数不合规则'})
    }else{
        result = await UserAuth.findRepeatUIdentifier(identifier,identity_type)
    }
    ctx.body = result;
    
}

const userBindStatus = async ( ctx ,next ) => {
    let result  = { success : false }
    let user_id = ctx.request.body.id;
    if(!user_id){
        result = Object.assign(result,{msg :'参数不合规则'})
    }else{
        result = await UserAuth.userBindStatus(user_id)
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

const findEmailSendPAC = async (ctx ,next) => {
    let result = { success :false }
    let email = ctx.request.body.email;
    let uid = ctx.request.body.uid;
    const email_reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(email && email_reg.test(email) && uid){
        result = await UserAuth.findEmailSendPAC(email);
        if(result.success && result.data){
            ctx.redis.set(`email-pac-${uid}`,result.data,'EX',1 * 60 * 60);     // 验证码保存在redis上，时间1小时
        }
        result = { success :true ,msg :'验证码已发送请注意查收'}
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

const bindUserEmail = async (ctx ,next) => {
    let result = { success :false }
    const user_id = ctx.request.body.uid;
    const email = ctx.request.body.email;
    const req_pac = ctx.request.body.pac;
    if(user_id && email && req_pac){
        const redis_pac = await ctx.redis.get(`email-pac-${user_id}`);
        if(req_pac == redis_pac){
            result = await UserAuth.bindUserEmail(user_id,email)
            ctx.redis.del(`email-pac-${user_id}`)
        }else{
            result = Object.assign(result,{msg :'验证码错误'})
        }
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

const bindHostUserNameOrUpdatePassword = async (ctx ,next) => {
    let result = { success :false }
    const uid = ctx.request.body.uid;
    const uname = ctx.request.body.uname;
    const pass = ctx.request.body.pass;
    const old_pass = ctx.request.body.old_pass;
    if(uid && uname && pass){
        result = await UserAuth.bindHostUserNameOrUpdatePassword(uid,uname,pass,old_pass);
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

const bindUserQQ = async (ctx ,next) => {
    let result = { success :false }
    const code = ctx.request.body.code;
    const user_id = ctx.request.body.uid;
    if(code && user_id){
        result = await UserAuth.bindUserQQ(user_id,code);
    }else{
        result = Object.assign(result,{msg :'参数不合规则'});
    }
    ctx.body = result;
}

// 根据验证码修改密码 ，这里验证码获取方法是通过email而来的
const updatePassByEmail = async (ctx ,next) => {
    let result = { success :false }
    const uid = ctx.request.body.uid;
    const pass = ctx.request.body.pass;
    const pac = ctx.request.body.pac;
    if(uid && pass && pac){
        const redis_pac = await ctx.redis.get(`email-pac-${uid}`);
        console.log(pac,redis_pac)
        if(pac == redis_pac){
            result = await UserAuth.updatePassByUserID(uid,pass)
            ctx.redis.del(`email-pac-${uid}`)
        }else{
            result = Object.assign(result,{msg :'验证码错误'})
        }
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}



module.exports = {
    hostLogin,
    hostRegister,
    findRepeatUIdentifier,
    qqLogin,
    userBindStatus,
    findEmailSendPAC,
    bindUserEmail,
    bindHostUserNameOrUpdatePassword,
    bindUserQQ,
    updatePassByEmail
}