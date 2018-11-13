const Admin = require('../proxy').Admin;
const { issueToken } = require('../common').Jwt;
const UUID = require('uuid');
const Config = require('../config');
const md5 = require('md5')

const register = async (ctx ,next) => {
    let result = await Admin.register('超级管理员',Config.admin);
    ctx.body = result;
}



/**
 * 管理员登陆时，所发送验证邮箱的，验证码获取。
 * @param {*} ctx 
 * @param {*} next 
 */
const sendPac = async ( ctx ,next ) => {
    let result = { success :false };
    let email = ctx.request.body.email;
    if(email){
        let pac = UUID.v4().substr(0,6);
        await ctx.redis.set(`admin-email-login-pac-${email}`,pac,'EX',1 * 60 * 60);  
        result = await Admin.sendPac(email,pac);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result;
}

const login = async ( ctx ,next ) => {
    let result = { success : false ,msg :'未知错误' }
    const username = ctx.request.body.userName;
    const password = ctx.request.body.password;
    if(username && password){
        result = await Admin.UNLogin(username,md5(password));
        if(result.success){
            const admin_id = result.data._id;
            const exp = Date.now() + 1000 * 60 * 10;   // token过期时间
            const jwt = issueToken({ aud :admin_id ,secretKey :Config.JwtKey ,exp ,role :'admin' });
            const jwt_token = jwt.token;
            const jwt_jti = jwt.data.jti;
            const Json = JSON.stringify({ id :jwt_jti ,token :jwt_token }); 
            await ctx.redis.set(`TOKEN-ADMIN-${admin_id}`,Json,'EX',exp);  
            const AdminData = result.data
            const newAdminData = Object.assign(AdminData ,{ jwt_token ,exp_time:new Date(exp) })
            result = Object.assign(result , { data : newAdminData })
            ctx.session.role = 'admin'
        }
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result
}

const find = async ( ctx ,next ) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let result = await Admin.find(page,size);
    ctx.body = result;
}

const generateCDKEY = async ( ctx ,next ) => {
    let result = { success :false };
    let email = ctx.request.body.email;
    if(email){
        let pac = UUID.v4();
        await ctx.redis.set(`admin-email-register-cdkey-${email}`,pac,'EX',1 * 60 * 60);  
        result = { success :true ,data :pac }
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result;
}

/**
 * 子用户注册。必须要超级管理员的 激活码
 */
const childAdminRegister = async ( ctx ,next ) => {
    let result = { success :false };
    let name = ctx.request.body.name;
    let email = ctx.request.body.email;
    let pac = ctx.request.body.pac;
    let cdkey = ctx.request.body.cdkey;
    if(email && pac && cdkey){
        let r_pac = await ctx.redis.get(`admin-email-login-pac-${email}`);  
        let r_cdkey = await ctx.redis.get(`admin-email-register-cdkey-${email}`);
        if(r_cdkey == cdkey && r_pac == pac){
            result = await Admin.register(name,email);
            ctx.redis.del(`admin-email-register-cdkey-${email}`)
            ctx.redis.del(`admin-email-login-pac-${email}`)
        }else{
            result = Object.assign(result ,{ msg :'错误的验证' });
        }
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result;
}

const remove = async ( ctx ,next) => {
    let result = { success :false };
    let id = ctx.request.body.id;
    if(id){
        result = await Admin.remove(id);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });  
    }
    ctx.body = result;
}


module.exports = {
    register,
    sendPac,
    login,
    find,
    generateCDKEY,
    childAdminRegister,
    remove
}