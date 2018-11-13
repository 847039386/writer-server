const UserAuth = require('../proxy').UserAuth;
const Conf = require('../config');
const JWT = require('../common/jwt');
var md5 = require("md5")

const hostLogin = async ( ctx , next ) => {
    let uname = ctx.request.body.uname;
    let pass = ctx.request.body.pass;
    let result = { success :false }
    if(uname && pass){
        result = await UserAuth.hostLogin(uname ,md5(pass))
        if(result.success){
            let user = result.data;
            if(user.status == 0){
                const referer = ctx.session.login_referer || '/';
                const jwt = JWT.issueToken({ aud :user._id ,secretKey :Conf.JwtKey })
                const jwt_jti = jwt.data.jti;
                const jwt_token = jwt.token;
                const Json = JSON.stringify({ id :jwt_jti ,token :jwt_token });
                user = Object.assign(user, { token :jwt_token });
                ctx.session.user = user;
                await ctx.redis.set(`TOKEN-USER-${user._id}`,Json,'EX',1000  * 60 * 60 * 24);
                result = Object.assign(result ,{ data : user ,referer : ctx.session.login_referer || '/' });
            }else{
                result = Object.assign(result ,{ msg :'您的账户已被限制登陆。' });
            }
        }
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
    if(name && uname && pass){
        let ri = Math.floor(Math.random()*16 + 1);
        result = await UserAuth.toRegister(name,uname,`/images/avatar/${ri}.png`,pass);
        if(result.success){
            let user = result.data;
            ctx.session.user = user;
            const jwt = JWT.issueToken({ aud :user._id ,secretKey :Conf.JwtKey })
            const jwt_jti = jwt.data.jti;
            const jwt_token = jwt.token;
            const Json = JSON.stringify({ id :jwt_jti ,token :jwt_token });
            user = Object.assign(user, { token :jwt_token });
            await ctx.redis.set(`TOKEN-USER-${user._id}`,Json,'EX',1000  * 60 * 60 * 24);
            result = Object.assign(result,{ data: user , referer : ctx.session.login_referer || '/' })
        }
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

// 绑定时 使用 uid 与 email 发送验证码
const findEmailSendPAC = async (ctx ,next) => {
    let result = { success :false }
    let email = ctx.request.body.email;
    let uid = ctx.request.body.uid;
    const email_reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(email_reg.test(email) && uid){
        result = await UserAuth.findEmailSendPAC(email);
        if(result.success && result.data){
            ctx.redis.set(`PAC-USER-EMAIL-${uid}`,JSON.stringify({
                TYPE        :'bind',
                EMAIL       :email,
                CODE        :result.data
            }),'EX',1 * 60 * 60);     // 验证码保存在redis上，时间1小时
            result = { success :true ,msg :'验证码已发送请注意查收'}
        }else{
            result = { success :false ,msg :'验证码发送失败'}
        }
        
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

const changeEmailPac = async (ctx ,next) => {
    let result = { success :false }
    let email = ctx.request.body.email;
    let uid = ctx.request.body.uid;
    const email_reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(email_reg.test(email) && uid){
        result = await UserAuth.changeEmailPac(uid,email);
        if(result.success){
            ctx.redis.set(`PAC-USER-UPEMAIL-${uid}`,JSON.stringify({
                old_mail :result.data.old_mail,
                new_mail :result.data.new_mail,
                old_pac :result.data.old_pac,
                new_pac :result.data.new_pac,
            }),'EX',1 * 60 * 60);     // 验证码保存在redis上，时间1小时
            result = { success :true ,msg :'验证码已发送请注意查收'}
        }
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

const changeEmail = async (ctx ,next) => {
    let result = { success :false }
    let uid = ctx.request.body.uid;
    let email = ctx.request.body.email;
    let opac = ctx.request.body.opac;
    let npac = ctx.request.body.npac;
    const email_reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(email_reg.test(email) && uid && opac && npac){
        let redis_pac = await ctx.redis.get(`PAC-USER-UPEMAIL-${uid}`);
        redis_pac = JSON.parse(redis_pac);
        const old_pac = redis_pac ? redis_pac.old_pac : null;
        const new_pac = redis_pac ? redis_pac.new_pac : null;
        const new_mail = redis_pac ? redis_pac.new_mail : null;
        const old_mail = redis_pac ? redis_pac.old_mail : null;
        if(!redis_pac){
            result = { success :false ,msg :'请填写正确的验证码' }
        }else if(old_pac !== opac){
            result = { success :false ,msg :'旧邮箱验证码错误' }
        }else if(new_pac != npac){
            result = { success :false ,msg :'新邮箱验证码错误' }
        }else if(new_mail && new_mail !==email || !new_mail){
            result = { success :false ,msg :'新邮箱出现了错误' }
        }else if(new_mail == old_mail){
            result = { success :false ,msg :'新邮箱与旧邮箱不允许一样' }
        }else{
            result = await UserAuth.updateEmailByUserID(uid,new_mail);
            if(result.success){
                ctx.redis.del(`PAC-USER-UPEMAIL-${uid}`)
            }
        }
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

// 根据用户id 查找 email 并且 发送验证码
const findUserAuthSendEmailPAC = async (ctx ,next) => {
    let result = { success :false }
    let uid = ctx.request.body.uid;
    let authUser = await UserAuth.findAuthIdentity(uid);
    if(authUser.success && authUser.data && authUser.data.identity.email.identifier){
        result = await UserAuth.findEmailSendPAC(authUser.data.identity.email.identifier);
        if(result.success && result.data){
            ctx.redis.set(`PAC-USER-USERNAME-${uid}`,result.data,'EX',1 * 60 * 60);     // 验证码保存在redis上，时间1小时
        }
        result = { success :true ,msg :'验证码已发送请注意查收'}
    }else{
        result = authUser;
    }
    ctx.body = result;
}



const bindUserEmail = async (ctx ,next) => {
    let result = { success :false }
    const user_id = ctx.request.body.uid;
    const email = ctx.request.body.email;
    const req_pac = ctx.request.body.pac;
    if(user_id && email && req_pac){
        let PAC = await ctx.redis.get(`PAC-USER-EMAIL-${user_id}`);
        PAC = JSON.parse(PAC);
        if( PAC.CODE == req_pac && PAC.TYPE == 'bind' && email == PAC.EMAIL){
            result = await UserAuth.bindUserEmail(user_id,email)
            if(result.success){
                ctx.redis.del(`PAC-USER-EMAIL-${user_id}`)
            }
        }else{
            result = Object.assign(result,{msg :'验证码错误'})
        }
    }else{
        result = Object.assign(result,{msg :'参数不合规则'})
    }
    ctx.body = result;
}

const bindHostUserName = async (ctx ,next) => {
    let result = { success :false }
    const uid = ctx.request.body.uid;
    const uname = ctx.request.body.uname;
    const pass = ctx.request.body.pass;
    const pac = ctx.request.body.pac;
    if(uid && uname && pass && pac){
        let PAC = await ctx.redis.get(`PAC-USER-USERNAME-${uid}`);
        if(PAC === pac){
            result = await UserAuth.bindHostUserName(uid,uname,pass);
            if(result.success){
                ctx.redis.del(`PAC-USER-USERNAME-${uid}`)
            }
        }else{
            result = Object.assign(result,{msg :'验证码错误'})
        }
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
    const uname = ctx.request.body.uname;
    const pass = ctx.request.body.pass;
    const pac = ctx.request.body.pac;
    if(uid && pass && pac){
        const redis_pac = await ctx.redis.get(`PAC-USER-USERNAME-${uid}`);
        if(pac == redis_pac){
            result = await UserAuth.updatePassByUserID(uid,uname,pass)
            if(result.success){
                ctx.redis.del(`PAC-USER-USERNAME-${uid}`)
            }
        }else if(!redis_pac){
            result = Object.assign(result,{msg :'未获取验证码'})
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
    findEmailSendPAC,
    bindUserEmail,
    bindHostUserName,
    bindUserQQ,
    updatePassByEmail,
    findUserAuthSendEmailPAC,
    changeEmailPac,
    changeEmail
}