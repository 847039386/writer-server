const Admin = require('../proxy').Admin;
const Config = require('../config')

const register = async (ctx ,next) => {
    let result = await Admin.register('超级管理员',Config.admin);
    ctx.body = result;
}

const sendPac = async ( ctx ,next ) => {
    let result = { success :false };
    let email = ctx.request.body.email;
    if(email){
        result = await Admin.sendPac(email);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result;
}

const login = async ( ctx ,next ) => {
    let result = { success :false };
    let pac = ctx.request.body.pac;
    let email = ctx.request.body.email;
    if(email && pac){
        result = await Admin.login(email,pac)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result
}


module.exports = {
    register ,sendPac ,login
}